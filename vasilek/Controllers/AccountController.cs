using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using vasilek.ViewModels; // пространство имен моделей RegisterModel и LoginModel
using vasilek.Models; // пространство имен UserContext и класса User
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using vasilek.Repository;

namespace vasilek.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : Controller
    {
        private AppDatabaseContext _ctx;
        private UserRepository userRepository; 
        public AccountController(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            userRepository = new UserRepository(_ctx);
        }

        [HttpGet]
        public UserModel IsAuth()
        {
            if(HttpContext.User.Identity.IsAuthenticated)
                return userRepository.GetUserByLogin(HttpContext.User.Identity.Name);
            return new UserModel();
        }

        [HttpPost]
        public async Task<bool> Login([FromBody]LoginModel model)
        {
            if (ModelState.IsValid)
            {
                UserModel user = await _ctx.Users.FirstOrDefaultAsync(u => u.Login == model.Login && u.Password == model.Password);
                if (user != null)
                {
                    await Authenticate(user); // аутентификация
                    return true;
                }
                else
                    return false;
            }
            return false;
        }

        [HttpPost]
        public async Task<bool> Register([FromBody]RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                UserModel user = await _ctx.Users.FirstOrDefaultAsync(u => u.Login == model.Login);
                if (user == null)
                {
                    _ctx.Users.Add(new UserModel { Login = model.Login, Password = model.Password });
                    await _ctx.SaveChangesAsync();
                    await Authenticate(user); // аутентификация
                    return true;
                }
                else
                    return false;
            }
            return false;
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

        public async Task<bool> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return true;
        }
    }
}