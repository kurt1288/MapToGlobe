namespace MapToGlobe.Models
{
   public class EmailSettings
   {
      public string APIKey { get; set; }
      public string APIBaseUri { get; set; }
      public string RequestUri { get; set; }
      public string ToEmail { get; set; }
      public string FromEmail { get; set; }
      public string Subject { get; set; }
   }
}
