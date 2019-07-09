using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapToGlobe.Models
{
   public class ReCaptcha
   {
      public string SecretKey { get; set; }
   }

   public class ReCatpchaResponse
   {
      public bool Success { get; set; }
   }
}
