using vasilek.Models;
using vasilek.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace vasilek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private AppDatabaseContext _ctx;
        private UserRepository userRepository;
        public UsersController(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            userRepository = new UserRepository(_ctx);
        }

        [HttpGet("{id}")]
        public UserModel Get(int id)
        {
            return userRepository.GetUserById(id);
        }

        [HttpGet("{page}/{count}")]
        public IEnumerable<UserModel> Get(int page, int count)
        {
            return userRepository.GetUsers(count, --page * count);
        }

        [HttpPut]
        public UserModel Put([FromBody]UserModel updatedUser)
        {
            return userRepository.EditUserByLogin(HttpContext.User.Identity.Name, updatedUser);
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
