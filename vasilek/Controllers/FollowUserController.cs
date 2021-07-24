using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using vasilek.Models;
using vasilek.Repository;

namespace vasilek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FollowUserController : ControllerBase
    {
        JsonSerializerSettings JsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
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
                }, JsonSettings);

            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 0,
                Data = userRepository.FollowUser(senderId, id)
            }, JsonSettings);
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
                }, JsonSettings);
            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 0,
                Data = userRepository.UnFollowUser(senderId, id)
            }, JsonSettings);
        }
    }
}
