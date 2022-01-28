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

        private readonly Blob _blob;
        private readonly FilesUtils _filesUtils;

        public DialogsController(Blob blob, FilesUtils filesUtils)
        {
            _blob = blob;
            _filesUtils = filesUtils;
        }

        [HttpPost]
        public async Task<string> File([FromForm]IFormFile file)
        {
            try
            {
                await _blob.SaveFilePinnedToMessage(file, file.FileName);
                //await _filesUtils.SaveFilePinnedToMessage(file, file.FileName);
                return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 0 }, JsonSettings);
            }
            catch
            {
                return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 1, Messages = new string[] { "File can not be saved" } }, JsonSettings);
            }
        }
    }
}
