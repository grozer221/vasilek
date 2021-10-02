using vasilek.Models;
using vasilek.Repository;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using vasilek.Utils;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

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

        private readonly AppDatabaseContext _ctx;
        private IConfigurationRoot _confString;
        private Blob _blob;

        public DialogsController(AppDatabaseContext ctx, IHostEnvironment hostEnvironment)
        {
            _ctx = ctx;
            _confString = new ConfigurationBuilder().SetBasePath(hostEnvironment.ContentRootPath).AddJsonFile("appsettings.json").Build();
            _blob = new Blob(_confString);
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
