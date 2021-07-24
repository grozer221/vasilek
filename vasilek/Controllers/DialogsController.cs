using vasilek.Models;
using vasilek.Repository;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json.Serialization;

namespace vasilek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DialogsController : ControllerBase
    {
        JsonSerializerSettings JsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
        private AppDatabaseContext _ctx;
        private UserRepository _userRep;
        private DialogsRepository _dialogsRep;
        public DialogsController(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _userRep = new UserRepository(_ctx);
            _dialogsRep = new DialogsRepository(_ctx);
        }

        [HttpGet]
        public string Get([FromQuery]int toid)
        {
            int dialogId = _dialogsRep.WriteTo(HttpContext.User.Identity.Name, toid);
            return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 0, Data = dialogId }, JsonSettings);
        }
    }
}
