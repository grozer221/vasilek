using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using System.Threading.Tasks;

namespace vasilek.Utils
{
    public class Blob
    {
        private string _blobConnection = "DefaultEndpointsProtocol=https;AccountName=vasilekblobstorage;AccountKey=BYlY6T1Pl2GhOSaaIo4AANzSId53g/2QeX6hrluWaO26CjJAXZoMeEaWzgiPdP9hr0ReuPFqFk5LdpziyX0ISA==;EndpointSuffix=core.windows.net";

        private async Task UploadFileToBlob(string containerName, IFormFile file, string fileName)
        {
            var cloudStorageAccount = CloudStorageAccount.Parse(_blobConnection);
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
