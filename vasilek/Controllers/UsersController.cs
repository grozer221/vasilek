using vasilek.Models;
using vasilek.Repository;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Linq;

namespace vasilek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private AppDatabaseContext _ctx;
        private UserRepository _userRep;
        public UsersController(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _userRep = new UserRepository(_ctx);
        }

        [HttpGet]
        public string Get([FromQuery] bool friends, [FromQuery] string term, [FromQuery] int page = 1, [FromQuery] int count = 5)
        {
            if (friends == true && !HttpContext.User.Identity.IsAuthenticated)
                return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 1, Messages = new string[] { "User must be authorized to see friends" } });
            ResponseUserModel data = new ResponseUserModel();
            if (friends == false && term == null)
                data = new ResponseUserModel()
                {
                    Users = _userRep.GetUsers(count, --page * count),
                    Count = _userRep.GetUsersCount()
                };
            else if (friends == false & term != null)
            {
                int usersCount = 0;
                data = new ResponseUserModel()
                {
                    Users = _userRep.GetUsersWithTerm(term, ref usersCount, count, --page * count),
                    Count = usersCount
                };
            }
            else if (friends == true && term == null)
            {
                int friendsCount = 0;
                data = new ResponseUserModel()
                {
                    Users = _userRep.GetFriends(_userRep.GetUserIdByLogin(HttpContext.User.Identity.Name), ref friendsCount, count, --page * count),
                    Count = friendsCount
                };
            }
            else if (friends == true && term != null)
            {
                int unFriendsCount = 0;
                data = new ResponseUserModel()
                {
                    Users = _userRep.GetFriendsWithTerm(_userRep.GetUserIdByLogin(HttpContext.User.Identity.Name), term, ref unFriendsCount, count, --page * count),
                    Count = unFriendsCount
                };
            }
            return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 0, Data = data });

        }
    }
}
