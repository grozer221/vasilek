using Microsoft.AspNetCore.Mvc;
using vasilek.Models;
using vasilek.Repository;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.IO;
using System;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;

namespace vasilek.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private AppDatabaseContext _ctx;
        private ProfileRepository _profileRep;
        private UserRepository _userRep;
        private CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=vasilek;AccountKey=ga855L/qIGAioZbnCI0IkbXJoQsdodXPB1YLHNw6rcUrtVxRe4h0cstxdlttqSBFOB5VKMHamqkHYaoB/0WZZw==;EndpointSuffix=core.windows.net");

        public ProfileController(AppDatabaseContext ctx )
        {
            _ctx = ctx;
            _profileRep = new ProfileRepository(_ctx);
            _userRep = new UserRepository(_ctx);
        }

        [HttpGet("{id}")]
        public ResponseModel Get(int id)
        {
            return new ResponseModel() 
            {
                ResultCode = 0,
                Data = _profileRep.GetProfileById(id)
            };
        }

        [HttpPut]
        public ResponseModel Put([FromBody] UserModel updatedUser)
        {
            return new ResponseModel()
            {
                ResultCode = 0,
                Data = _profileRep.EditProfileByLogin(HttpContext.User.Identity.Name, updatedUser)
            };
        }

        [HttpPut("{status}")]
        public ResponseModel Status(string status)
        {
            if (!_profileRep.UpdateStatusByLogin(HttpContext.User.Identity.Name, status))
                return new ResponseModel()
                {
                    ResultCode = 1,
                    Messages = new string[] { "Error" }
                }; 
            return new ResponseModel()
            {
                ResultCode = 0,
                Data = status
            };
        }

        [HttpPost]
        public async Task<ResponseModel> Photo(IFormFile photo)
        {
            if (photo == null)
                return new ResponseModel()
                {
                    ResultCode = 1,
                    Messages = new string[] { "Photo is empty" }
                };
            string photoName = await UploadToAzurePhoto(photo);
            _profileRep.SetAvaPhotoByLogin(HttpContext.User.Identity.Name, photoName);
            _profileRep.AddPhotoByUserId(_userRep.GetUserIdByLogin(HttpContext.User.Identity.Name), photoName);
            return new ResponseModel() { ResultCode = 0, Data = photoName };
        }

        [NonAction]
        public async Task<string> UploadToAzurePhoto(IFormFile photo)
        {
            string photoName = HttpContext.User.Identity.Name + "_" + DateTime.Now.ToString("yy-MM-dd_HH_mm_ss") + Path.GetExtension(photo.FileName);
            var cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
            var cloudBlobContainer = cloudBlobClient.GetContainerReference("userphotoscontainer");
            if(await cloudBlobContainer.CreateIfNotExistsAsync())
                await cloudBlobContainer.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Off });
            var cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(photoName);
            cloudBlockBlob.Properties.ContentType = photo.ContentType;
            await cloudBlockBlob.UploadFromStreamAsync(photo.OpenReadStream());
            return photoName;
        }
    }
}
