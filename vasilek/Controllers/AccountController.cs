using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using vasilek.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using vasilek.Repository;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace vasilek.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : Controller
    {
        JsonSerializerSettings JsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
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
            {
                var user = _profileRep.GetProfileWithPhotosByLogin(HttpContext.User.Identity.Name);
                user.Password = null;
                return JsonConvert.SerializeObject(new ResponseModel()
                {
                    ResultCode = 0,
                    Data = user,
                }, JsonSettings);
            }
            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 1,
                Messages = new string[] { "User unautorised" },
                Data = null,
            }, JsonSettings);
        }

        [HttpPost]
        public async Task<string> Login([FromBody]LoginModel model)
        {
            if (ModelState.IsValid)
            {
                UserModel user = _userRep.GetUserWithPhotosByLoginAndPass(model.Login, model.Password);
                if (user != null)
                {
                    await Authenticate(user); // аутентификация
                    user.Password = null;
                    return JsonConvert.SerializeObject(new ResponseModel()
                    {
                        ResultCode = 0,
                        Data = user,
                    }, JsonSettings);
                }
            }
            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 1,
                Messages = new string[] { "Login or password is invalid" },
            }, JsonSettings);
        }

        [HttpPost]
        public async Task<string> Register([FromBody]RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.Password != model.ConfirmPassword)
                    return JsonConvert.SerializeObject(new ResponseModel()
                    {
                        ResultCode = 1,
                        Messages = new string[] { "Password do not match" },
                    }, JsonSettings);
                UserModel user = _userRep.GetUserByLogin(model.Login);
                if (user == null)
                {
                    user = new UserModel
                    {
                        Login = model.Login,
                        Password = model.Password,
                        NickName = model.NickName
                    };
                    _userRep.AddUser(user);
                    await Authenticate(user); // аутентификация
                    user.Password = null;
                    return JsonConvert.SerializeObject(new ResponseModel()
                    {
                        ResultCode = 0,
                        Data = user
                    }, JsonSettings);
                }
            }

            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 1,
                Messages = new string[] { "User with wrote login already exist" },
            }, JsonSettings);
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
            return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 0 }, JsonSettings);
        }
    }
}