using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MapToGlobe.Models;
using CodenameGenerator;
using System.IO;
using System.Text;
using System.Collections.Generic;

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

      [Route("{loadkey?}")]
      public IActionResult Index(string loadkey)
      {
         if (!string.IsNullOrWhiteSpace(loadkey))
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
            string key = Path.GetRandomFileName();
            key = key.Substring(0, 8);

            SavedScenes data = new SavedScenes { Id = id, Json = clientData.Data, Editkey = key };

            _databaseContext.SavedScenes.Add(data);
            _databaseContext.SaveChanges();

            // Return a new json string without the saved json string because it doesn't need to be sent back to the client
            return new JsonResult(Newtonsoft.Json.JsonConvert.SerializeObject(new { id = data.Id, key = data.Editkey }));
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
            _databaseContext.SaveChanges();
         }
         catch (System.InvalidOperationException)
         {
            return StatusCode(400);
         }

         return Ok();
      }

      [HttpPost, ValidateAntiForgeryToken]
      public async Task<IActionResult> SendMessage([FromForm]ContactForm formValues)
      {
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
