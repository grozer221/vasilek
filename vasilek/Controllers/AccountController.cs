using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using vasilek.ViewModels;
using vasilek.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using vasilek.Repository;
using Newtonsoft.Json;

namespace vasilek.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : Controller
    {
        private AppDatabaseContext _ctx;
        private ProfileRepository _profileRep; 
        private UserRepository _userRep; 
        public AccountController(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _profileRep = new ProfileRepository(_ctx);
            _userRep = new UserRepository(_ctx);
        }

        [HttpGet]
        public string IsAuth()
        {
            if (HttpContext.User.Identity.IsAuthenticated)
                return JsonConvert.SerializeObject(new ResponseModel()
                {
                    ResultCode = 0,
                    Data = _profileRep.GetProfileByLogin(HttpContext.User.Identity.Name)
                });
            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 1,
                Messages = new string[] { "User unautorised" },
                Data = null,
            });
        }

        [HttpPost]
        public async Task<string> Login([FromBody]LoginModel model)
        {
            if (ModelState.IsValid)
            {
                UserModel user = await _ctx.Users.FirstOrDefaultAsync(u => u.Login == model.Login && u.Password == model.Password);
                if (user != null)
                {
                    await Authenticate(user); // аутентификация
                    return JsonConvert.SerializeObject(new ResponseModel()
                    {
                        ResultCode = 0,
                        Data = _userRep.GetUserByLogin(model.Login)
                    });
                }
            }
            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 1,
                Messages = new string[] { "Login or password invalid" },
            });
        }

        [HttpPost]
        public async Task<string> Register([FromBody]RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                UserModel user = await _ctx.Users.FirstOrDefaultAsync(u => u.Login == model.Login);
                if (user == null)
                {
                    _ctx.Users.Add(new UserModel { Login = model.Login, Password = model.Password });
                    await _ctx.SaveChangesAsync();
                    await Authenticate(user); // аутентификация
                    return JsonConvert.SerializeObject(new ResponseModel()
                    {
                        ResultCode = 0,
                        Data = model
                    });
                }
            }
            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 1,
                Messages = new string[] { "User with wrote login already exist" },
            });
        }

        private async Task Authenticate(UserModel user)
        {
            // создаем один claim
            var claims = new List<Claim> {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Login),
            };
            // создаем объект ClaimsIdentity
            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            // установка аутентификационных куки
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
        }

        [HttpDelete]
        public async Task<string> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 0 });
        }
    }
}