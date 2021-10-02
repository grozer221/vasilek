using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace vasilek.Utils
{
    public class Blob
    {
        IConfigurationRoot _confString;

        public Blob(IConfigurationRoot confString)
        {
            _confString = confString;
        }

        private async Task UploadFileToBlob(string containerName, IFormFile file, string fileName)
        {
            var cloudStorageAccount = CloudStorageAccount.Parse(_confString.GetConnectionString("BlobConnection"));
            var cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
            var cloudBlobContainer = cloudBlobClient.GetContainerReference(containerName);
            if (await cloudBlobContainer.CreateIfNotExistsAsync())
                await cloudBlobContainer.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Off });
            var cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(fileName);
            cloudBlockBlob.Properties.ContentType = file.ContentType;
            await cloudBlockBlob.UploadFromStreamAsync(file.OpenReadStream());
        }

        public async Task SaveUserPhoto(IFormFile photo, string photoName)
        {
            await UploadFileToBlob("users-photos", photo, photoName);
        }

        public async Task SaveFilePinnedToMessage(IFormFile file, string fileName)
        {
            await UploadFileToBlob("files-pinned-to-messages", file, fileName);
        }

    }
}
