using vasilek.Models;
using vasilek.Repository;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using vasilek.Utils;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
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
        private readonly AppDatabaseContext _ctx;
        private readonly UserRepository _userRep;
        private readonly DialogsRepository _dialogRep;
        private CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=vasilek;AccountKey=ga855L/qIGAioZbnCI0IkbXJoQsdodXPB1YLHNw6rcUrtVxRe4h0cstxdlttqSBFOB5VKMHamqkHYaoB/0WZZw==;EndpointSuffix=core.windows.net");
        public DialogsController(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _userRep = new UserRepository(_ctx);
            _dialogRep = new DialogsRepository(_ctx);
        }

        [HttpPost]
        public async Task<string> File([FromForm]IFormFile file)
        {
            await UploadFilesPinnedToMessage(file);
            return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 0, Data = null }, JsonSettings);
        }

        [NonAction]
        public async Task UploadFilesPinnedToMessage(IFormFile file)
        {
            var cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
            var cloudBlobContainer = cloudBlobClient.GetContainerReference("files-pinned-to-message");
            if (await cloudBlobContainer.CreateIfNotExistsAsync())
                await cloudBlobContainer.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Off });
            var cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(file.FileName);
            cloudBlockBlob.Properties.ContentType = file.ContentType;
            await cloudBlockBlob.UploadFromStreamAsync(file.OpenReadStream());
        }
    }
}
