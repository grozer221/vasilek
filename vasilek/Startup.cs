using AuthSignalRApp;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Web.Http;
using vasilek.Hubs;
using vasilek.Utils;

namespace vasilek
{
    public class Startup
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public Startup(IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();
            string connectionString;
#if DEBUG
            //connectionString = $"server=localhost;database=vasilek;user=root;password=;port=3306";
            connectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=vasilek;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
            services.AddDbContext<AppDatabaseContext>(o => o.UseSqlServer(connectionString));

#else
            connectionString = Environment.GetEnvironmentVariable("JAWSDB_URL");
            connectionString = connectionString.Split("//")[1];
            string user = connectionString.Split(':')[0];
            connectionString = connectionString.Replace(user, "").Substring(1);
            string password = connectionString.Split('@')[0];
            connectionString = connectionString.Replace(password, "").Substring(1);
            string server = connectionString.Split(':')[0];
            connectionString = connectionString.Replace(server, "").Substring(1);
            string port = connectionString.Split('/')[0];
            string database = connectionString.Split('/')[1];
            connectionString = $"server={server};database={database};user={user};password={password};port={port}";
            services.AddDbContext<AppDatabaseContext>(o => o.UseMySQL(connectionString));
#endif

            services.AddSingleton<Blob>();
            services.AddSingleton<FilesUtils>();
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options => 
                {
                    options.LoginPath = new Microsoft.AspNetCore.Http.PathString("/api/account/login");
                });
            services.AddControllersWithViews();

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddSignalR(options =>
            {
                options.EnableDetailedErrors = true;
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute("DefaultApiWithId", "api/{controller}/{id}", new { id = RouteParameter.Optional }, new { id = @"\d+" });
                endpoints.MapControllerRoute("DefaultApiWithId", "api/{controller}/{count}/{page}", new { id = RouteParameter.Optional }, new { id = @"\d+" });
                endpoints.MapControllerRoute("DefaultApiWithAction", "api/{controller}/{action}");
                endpoints.MapHub<DialogsHub>("socket/dialogs");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
