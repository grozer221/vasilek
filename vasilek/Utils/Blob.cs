using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;

namespace vasilek.Utils
{
    public class Blob
    {
        private CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=vasilek;AccountKey=ga855L/qIGAioZbnCI0IkbXJoQsdodXPB1YLHNw6rcUrtVxRe4h0cstxdlttqSBFOB5VKMHamqkHYaoB/0WZZw==;EndpointSuffix=core.windows.net");
        private CloudBlobClient cloudBlobClient;
        private CloudBlobContainer cloudBlobContainer;
        private CloudBlockBlob cloudBlockBlob;

        public Blob()
        {
            cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
        }

        public async void UploadPhoto(IFormFile photo, string photoName)
        {
            cloudBlobContainer = cloudBlobClient.GetContainerReference("userphotoscontainer");
            if (await cloudBlobContainer.CreateIfNotExistsAsync())
                await cloudBlobContainer.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Off });
            cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(photoName);
            cloudBlockBlob.Properties.ContentType = photo.ContentType;
            await cloudBlockBlob.UploadFromStreamAsync(photo.OpenReadStream());
        }

    }
}
