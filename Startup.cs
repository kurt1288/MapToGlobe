using MapToGlobe.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MapToGlobe
{
   public class Startup
   {
      public Startup(IConfiguration configuration)
      {
         Configuration = configuration;
      }

      public IConfiguration Configuration { get; }

      public void ConfigureServices(IServiceCollection services)
      {
         services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
         services.AddEntityFrameworkNpgsql();
         services.AddDbContext<DatabaseContext>(options => options.UseNpgsql(Configuration.GetConnectionString("Database"))).BuildServiceProvider();
         services.AddOptions();
         services.Configure<EmailSettings>(Configuration.GetSection("EmailSettings"));
         services.AddHttpClient<Message>();
      }

      public void Configure(IApplicationBuilder app, IHostingEnvironment env)
      {
         if (env.IsDevelopment())
         {
            app.UseDeveloperExceptionPage();
         }
         else
         {
            app.UseStatusCodePagesWithReExecute("/Home/Error", "?statusCode={0}");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
         }

         app.UseHttpsRedirection();
         app.UseStaticFiles();

         app.UseMvc(routes =>
         {
            routes.MapRoute(
                   name: "default",
                   template: "{controller=Home}/{action=Index}/{id?}");
         });
      }
   }
}
