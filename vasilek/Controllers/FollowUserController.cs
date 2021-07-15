using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
        public string Get()
        {
            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 0,
                Data = userRepository.GetFollowedUsersByUserId(userRepository.GetUserIdByLogin(HttpContext.User.Identity.Name))
            });
        }

        [HttpPut("{id}")]
        public string Put(int id)
        {
            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 0,
                Data = userRepository.FollowUser(userRepository.GetUserIdByLogin(HttpContext.User.Identity.Name), id)
            });
        }

        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 0,
                Data = userRepository.UnFollowUser(userRepository.GetUserIdByLogin(HttpContext.User.Identity.Name), id)
            });
        }
    }
}
