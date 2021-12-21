using vasilek.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using vasilek.Utils;
using System.Threading.Tasks;

namespace vasilek.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class DialogsController : ControllerBase
    {
        JsonSerializerSettings JsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        private Blob _blob;

        public DialogsController(Blob blob)
        {
            _blob = blob;
        }

        [HttpPost]
        public async Task<string> File([FromForm]IFormFile file)
        {
            try
            {
                await _blob.SaveFilePinnedToMessage(file, file.FileName);
                return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 0 }, JsonSettings);
            }
            catch
            {
                return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 1, Messages = new string[] { "File can not be saved" } }, JsonSettings);
            }
        }
    }
}
