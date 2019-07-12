using Microsoft.EntityFrameworkCore;

namespace MapToGlobe
{
   /// <summary>
   /// This file was initially created automatically from the "database first" script in the Npgsql docs: http://www.npgsql.org/efcore/index.html
   /// </summary>
   public partial class DatabaseContext : DbContext
   {
      public DatabaseContext()
      {
      }

      public DatabaseContext(DbContextOptions<DatabaseContext> options)
         : base(options)
      {
      }

      public virtual DbSet<SavedScenes> SavedScenes { get; set; }

      protected override void OnModelCreating(ModelBuilder modelBuilder)
      {
         modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

         modelBuilder.Entity<SavedScenes>(entity =>
         {
               entity.Property(e => e.Editkey)
                  .IsRequired()
                  .HasColumnName("editkey")
                  .HasColumnType("character(8)");

               entity.Property(e => e.Id)
                  .IsRequired()
                  .HasColumnName("id")
                  .HasColumnType("character(200)");

               entity.Property(e => e.Json)
                  .IsRequired()
                  .HasColumnName("json")
                  .HasColumnType("jsonb");

               entity.Property(e => e.Created)
                  .IsRequired()
                  .HasColumnName("created")
                  .HasColumnType("timestamp");

               entity.Property(e => e.Updated)
                  .HasColumnName("updated")
                  .HasColumnType("timestamp");

               entity.Property(e => e.DeleteKey)
                  .IsRequired()
                  .HasColumnName("deletekey")
                  .HasColumnType("character(11)");

               entity.Property(e => e.Name)
                  .HasColumnName("name")
                  .HasColumnType("character(25)");
         });
      }
   }
}
