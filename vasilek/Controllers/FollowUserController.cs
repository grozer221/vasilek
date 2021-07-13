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
        public ResponseModel Get()
        {
            return new ResponseModel()
            {
                ResultCode = 0,
                Data = userRepository.GetFollowedUsersByUserId(userRepository.GetUserIdByLogin(HttpContext.User.Identity.Name))
            };
        }

        [HttpPut("{id}")]
        public ResponseModel Put(int id)
        {
            return new ResponseModel()
            {
                ResultCode = 0,
                Data = userRepository.FollowUser(userRepository.GetUserIdByLogin(HttpContext.User.Identity.Name), id)
            };
        }

        [HttpDelete("{id}")]
        public ResponseModel Delete(int id)
        {
            return new ResponseModel()
            {
                ResultCode = 0,
                Data = userRepository.UnFollowUser(userRepository.GetUserIdByLogin(HttpContext.User.Identity.Name), id)
            };
        }
    }
}
