using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MapToGlobe.Models;
using CodenameGenerator;
using System.IO;

namespace MapToGlobe.Controllers
{
   public class HomeController : Controller
   {
      private readonly DatabaseContext _databaseContext;
      private readonly Message _message;

      public HomeController(DatabaseContext databaseContext, Message message)
      {
         _databaseContext = databaseContext;
         _message = message;
      }

      public IActionResult Index()
      {
         return View();
      }

      [Route("{loadkey}")]
      public IActionResult Index(string loadkey)
      {
         try
         {
            SavedScenes data = _databaseContext.SavedScenes.Single(x => x.Id == loadkey);
            ViewBag.LoadJson = data.Json;
         }
         catch (Exception)
         {
            return NotFound();
         }

         ViewBag.LoadKey = loadkey;
         return View();
      }

      [Route("help")]
      public IActionResult Help()
      {
         return View();
      }

      [Route("examples")]
      public IActionResult Examples()
      {
         return View();
      }

      [Route("contact")]
      public IActionResult Contact()
      {
         return View();
      }

      [Route("legal")]
      public IActionResult Legal()
      {
         return View();
      }

      [Route("legal/licenses")]
      public IActionResult Licenses()
      {
         return View();
      }

      [Route("legal/privacy")]
      public IActionResult Privacy()
      {
         return View();
      }

      [HttpPost]
      public IActionResult Save([FromBody] ClientSaveData clientData)
      {
         try
         {
            // Generator used to get id (points to specific save record)
            Generator generator = new Generator();
            generator.SetParts(WordBank.Adverbs, WordBank.Adjectives, WordBank.Nouns);
            generator.Separator = "";
            string id = generator.Generate();

            // Random is used to generate the secret key used for updating a save
            string editKey = Path.GetRandomFileName();
            editKey = editKey.Substring(0, 8);

            // Generate the delete key
            string deleteKey = Path.GetRandomFileName().Replace(".", string.Empty);

            DateTime currentTime = DateTime.UtcNow;

            SavedScenes data = new SavedScenes { Id = id, Json = clientData.Data, Editkey = editKey, Created = currentTime, DeleteKey = deleteKey, Updated = currentTime };

            _databaseContext.SavedScenes.Add(data);
            _databaseContext.SaveChanges();

            // Return a new json string without the saved json string because it doesn't need to be sent back to the client
            return new JsonResult(Newtonsoft.Json.JsonConvert.SerializeObject(new { id = data.Id, key = data.Editkey, delete = data.DeleteKey }));
         }
         catch (Exception)
         {
            return StatusCode(500);
         }
      }

      [HttpPost]
      public StatusCodeResult Update([FromBody] ClientSaveData clientData)
      {
         try
         {
            // Look for a record with the provided key and id. If no record is found, then the provided key and id do not match (so do not update the record)
            SavedScenes existingRecord = _databaseContext.SavedScenes.Single(x => x.Editkey == clientData.Key && x.Id == clientData.Id);
            existingRecord.Json = clientData.Data;
            existingRecord.Updated = DateTime.UtcNow;
            _databaseContext.SaveChanges();
         }
         catch (System.InvalidOperationException)
         {
            return StatusCode(400);
         }

         return Ok();
      }

      [Route("/delete/{id}/{key}/{deleteKey}")]
      public IActionResult Delete(string id, string key, string deleteKey)
      {
         try
         {
            // Look for a record with the provided key and id. If no record is found, then the provided keys and id do not match (so do nothing)
            SavedScenes existingRecord = _databaseContext.SavedScenes.Single(x => x.Editkey == key && x.Id == id && x.DeleteKey == deleteKey);
            _databaseContext.Remove(existingRecord);
            _databaseContext.SaveChanges();
         }
         catch (System.InvalidOperationException)
         {
            return StatusCode(400);
         }

         return RedirectToAction("Index");
      }

      [HttpPost, ValidateAntiForgeryToken]
      public async Task<IActionResult> SendMessage([FromForm]ContactForm formValues)
      {
         // Validate the provided Recaptcha verification token
         bool valid = await _message.ValidateToken(formValues.ReCaptchaToken);

         if (!valid)
            return StatusCode(500);

         bool result = await _message.Send(formValues.Email, formValues.Message);

         if (result)
         {
            return View("ThankYou");
         }
         else
         {
            return StatusCode(500);
         }
      }

      [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
      public IActionResult Error(int? statusCode = null)
      {
         if (statusCode.HasValue)
         {
            if (statusCode.Value == 404)
               return View("NotFound");
            else
               return View("Error");
         }

         return View("Error");
      }
   }

   public class ClientSaveData
   {
      public string Data { get; set; }
      public string Id { get; set; }
      public string Key { get; set; }
   }
}
