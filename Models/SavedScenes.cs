using System;

namespace MapToGlobe
{
   public partial class SavedScenes
   {
      public string Id { get; set; }
      public string Json { get; set; }
      public string Editkey { get; set; }
      public DateTime Created { get; set; }
      public DateTime Updated { get; set; }
      public string DeleteKey { get; set; }
      public string Name { get; set; }
   }
}
