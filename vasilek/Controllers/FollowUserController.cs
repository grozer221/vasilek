using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using vasilek.Models;
using vasilek.Repository;

namespace vasilek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FollowUserController : ControllerBase
    {
        private AppDatabaseContext _ctx;
        private UserRepository userRepository;
        public FollowUserController(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            userRepository = new UserRepository(_ctx);
        }

        [HttpPut("{id}")]
        public string Put(int id)
        {
            int senderId = userRepository.GetUserIdByLogin(HttpContext.User.Identity.Name);
            if (senderId == id)
                return JsonConvert.SerializeObject(new ResponseModel()
                {
                    ResultCode = 1,
                    Messages = new string[] {"You can`t follow youself"}
                });

            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 0,
                Data = userRepository.FollowUser(senderId, id)
            });
        }

        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            int senderId = userRepository.GetUserIdByLogin(HttpContext.User.Identity.Name);
            if (senderId == id)
                return JsonConvert.SerializeObject(new ResponseModel()
                {
                    ResultCode = 1,
                    Messages = new string[] { "You can`t unfollow youself" }
                });
            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 0,
                Data = userRepository.UnFollowUser(senderId, id)
            });
        }
    }
}
