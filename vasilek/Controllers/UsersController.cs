using vasilek.Models;
using vasilek.Repository;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet("{count}")]
        public ResponseModel Get(string count)
        {
            return new ResponseModel()
            {
                ResultCode = 0,
                Data = _userRep.GetUsersCount()
            };
        }

        [HttpGet("{page}/{count}")]
        public ResponseModel Get(int page, int count)
        {
            return new ResponseModel()
            {
                ResultCode = 0,
                Data = _userRep.GetUsers(count, --page * count)
            };
        }

        //[HttpPost]
        //public UserModel Post([FromBody]UserModel user)
        //{
        //    return userRepository.AddUser(user);
        //}

        //[HttpDelete("{id}")]
        //public UserModel Delete(int id)
        //{
        //    return userRepository.DeleteUserById(id);
        //}
    }
}
