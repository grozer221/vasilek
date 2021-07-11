using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using vasilek.Models;
using vasilek.Repository;

namespace vasilek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FollowUserController : ControllerBase
    {
        private AppDatabaseContext _ctx;
        private UserRepository userRepository;
        public FollowUserController(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            userRepository = new UserRepository(_ctx);
        }

        [HttpGet]
        public IEnumerable<int> Get()
        {
            return userRepository.GetFollowedUsersByUserId(userRepository.GetUserIdByLogin(HttpContext.User.Identity.Name));
        }

        [HttpPut("{id}")]
        public IEnumerable<int> Put(int id)
        {
            return userRepository.FollowUser(userRepository.GetUserIdByLogin(HttpContext.User.Identity.Name), id);
        }

        [HttpDelete("{id}")]
        public IEnumerable<int> Delete(int id)
        {
            return userRepository.UnFollowUser(userRepository.GetUserIdByLogin(HttpContext.User.Identity.Name), id);
        }
    }
}
