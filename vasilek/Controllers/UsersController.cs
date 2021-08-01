using vasilek.Models;
using vasilek.Repository;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace vasilek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        JsonSerializerSettings JsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
        private readonly AppDatabaseContext _ctx;
        private readonly UserRepository _userRep;
        public UsersController(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _userRep = new UserRepository(_ctx);
        }

        [HttpGet]
        public string Get([FromQuery] string term, [FromQuery] int page = 1, [FromQuery] int count = 9)
        {
            ResponseUserModel data = new ResponseUserModel();
            int usersCount = 0;
            if (term == null)
            {
                List<UserModel> users = _userRep.GetUsersByLogin(HttpContext.User.Identity.Name, ref usersCount, count, --page * count).ToList();
                foreach (var user in users)
                    user.Password = null;
                data = new ResponseUserModel()
                {
                    Users = users.AsQueryable(),
                    Count = usersCount,
                };
            }
            else if (term != null)
            {
                List<UserModel> users = _userRep.GetUsersWithTermByLogin(HttpContext.User.Identity.Name, term, ref usersCount, count, --page * count).ToList();
                foreach (var user in users)
                    user.Password = null;
                data = new ResponseUserModel()
                {
                    Users = users.AsQueryable(),
                    Count = usersCount,
                };
            }
            return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 0, Data = data }, JsonSettings);
        }
    }
}
