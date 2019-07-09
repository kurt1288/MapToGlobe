using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MapToGlobe.Models
{
   public class Message
   {
      private readonly EmailSettings _emailSettings;
      private readonly ReCaptcha _recaptcha;
      public HttpClient Client { get; }

      public Message(HttpClient client, IOptions<EmailSettings> emailSettings, IOptions<ReCaptcha> recaptcha)
      {
         _emailSettings = emailSettings.Value;
         _recaptcha = recaptcha.Value;

         client.BaseAddress = new Uri(_emailSettings.APIBaseUri);
         client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.ASCII.GetBytes(_emailSettings.APIKey)));

         Client = client;
      }

      public async Task<bool> Send(string email, string message)
      {
         FormUrlEncodedContent content = new FormUrlEncodedContent(new[]
         {
            new KeyValuePair<string, string>("to", _emailSettings.ToEmail),
            new KeyValuePair<string, string>("from", _emailSettings.FromEmail),
            new KeyValuePair<string, string>("h:Reply-To", email),
            new KeyValuePair<string, string>("subject", _emailSettings.Subject),
            new KeyValuePair<string, string>("text", message)
         });

         var response = await Client.PostAsync(_emailSettings.RequestUri, content).ConfigureAwait(false);

         if (response.IsSuccessStatusCode)
         {
            return true;
         }
         else
         {
            return false;
         }
      }

      public async Task<bool> ValidateToken(string token)
      {
         var response = await Client.PostAsync(string.Format("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}", _recaptcha.SecretKey, token), null);

         var jsonResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<ReCatpchaResponse>(response.Content.ReadAsStringAsync().Result);

         return jsonResponse.Success;
      }
   }

   public class ContactForm
   {
      public string Email { get; set; }
      public string Message { get; set; }
      [FromForm(Name = "g-recaptcha-response")]
      public string ReCaptchaToken { get; set; }
   }
}
