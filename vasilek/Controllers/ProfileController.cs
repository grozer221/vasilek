using Microsoft.AspNetCore.Mvc;
using vasilek.Models;
using vasilek.Repository;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.IO;
using System;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace vasilek.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        JsonSerializerSettings JsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
        private AppDatabaseContext _ctx;
        private ProfileRepository _profileRep;
        private UserRepository _userRep;
        private CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=vasilekstorage;AccountKey=9mUyFxIwhWybyOSj5FIRhIyT9ooUofTbqew9LinUrZ3Hx092NWuZPINwAo8JEXhlf1SASN+H0NVPNiQhLOKY3g==;EndpointSuffix=core.windows.net");

        public ProfileController(AppDatabaseContext ctx )
        {
            _ctx = ctx;
            _profileRep = new ProfileRepository(_ctx);
            _userRep = new UserRepository(_ctx);
        }

        [HttpGet("{id}")]
        public string Get(int id)
        {
            var user = _profileRep.GetProfileWithPhotosById(id);
            user.Password = null;
            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 0,
                Data = user,
            }, JsonSettings);
        }

        [HttpPut]
        public string Put([FromBody] UserModel updatedUser)
        {
            var user = _profileRep.EditProfileByLogin(HttpContext.User.Identity.Name, updatedUser);
            user.Password = null;
            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 0,
                Data = user,
            }, JsonSettings);
        }

        [HttpPost]
        public async Task<string> Photo(IFormFile photo)
        {
            if (photo == null)
                return JsonConvert.SerializeObject(new ResponseModel()
                {
                    ResultCode = 1,
                    Messages = new string[] { "Photo is empty" }
                }, JsonSettings);
            string photoName = await UploadToAzurePhoto(photo);
            //_profileRep.SetAvaPhotoByLogin(HttpContext.User.Identity.Name, photoName);
            var savedPhoto = _profileRep.AddPhotoByUserLogin(HttpContext.User.Identity.Name, photoName);
            return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 0, Data = savedPhoto}, JsonSettings);
        }
        
        [HttpDelete("{photoName}")]
        public string Photo(string photoName)
        {
            if (photoName == "")
                return JsonConvert.SerializeObject(new ResponseModel()
                {
                    ResultCode = 1,
                    Messages = new string[] { "Photo is empty" }
                }, JsonSettings);
            //_profileRep.SetAvaPhotoByLogin(HttpContext.User.Identity.Name, photoName);
            if(_profileRep.DeletePhotoByUserLogin(HttpContext.User.Identity.Name, photoName))
                return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 0 }, JsonSettings);
            else
                return JsonConvert.SerializeObject(new ResponseModel() { ResultCode = 1, Messages = new string[] { "It is not you photo"} }, JsonSettings);
        }

        [HttpPut]
        public string Photo([FromBody]PhotoModel photo)
        {
            string photoName;
            if (photo.PhotoName == "")
                photoName = null;
            else
                photoName = photo.PhotoName;
            _profileRep.SetAvaPhotoByUserLogin(HttpContext.User.Identity.Name, photoName);
            return JsonConvert.SerializeObject(new ResponseModel { ResultCode = 0 }, JsonSettings);
        }

        [NonAction]
        public async Task<string> UploadToAzurePhoto(IFormFile photo)
        {
            string photoName = HttpContext.User.Identity.Name + "_" + DateTime.Now.ToString("yy-MM-dd_HH_mm_ss") + Path.GetExtension(photo.FileName);
            var cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
            var cloudBlobContainer = cloudBlobClient.GetContainerReference("users-photos");
            if(await cloudBlobContainer.CreateIfNotExistsAsync())
                await cloudBlobContainer.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Off });
            var cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(photoName);
            cloudBlockBlob.Properties.ContentType = photo.ContentType;
            await cloudBlockBlob.UploadFromStreamAsync(photo.OpenReadStream());
            return photoName;
        }

        [HttpPut]
        public string Password([FromBody] ChangePassModel changePass)
        {
            if(changePass.Password != changePass.ConfirmPassword)
                return JsonConvert.SerializeObject(new ResponseModel { ResultCode = 1, Messages = new string[] { "Passwords do not match" } }, JsonSettings);
            if (_profileRep.ChangePasswordByLogin(HttpContext.User.Identity.Name, changePass))
                return JsonConvert.SerializeObject(new ResponseModel { ResultCode = 0 }, JsonSettings);
            else
                return JsonConvert.SerializeObject(new ResponseModel { ResultCode = 1, Messages = new string[] { "Old password entered incorrect" } }, JsonSettings);
        }
    }
}
