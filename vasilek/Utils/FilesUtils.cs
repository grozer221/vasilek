using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Threading.Tasks;

namespace vasilek.Utils
{
    public class FilesUtils
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        public FilesUtils(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }
        private async Task Save(IFormFile file, string folder, string fileName)
        {
            string uploadDir = Path.Combine(_webHostEnvironment.WebRootPath, "media", folder);
            fileName = Guid.NewGuid().ToString() + "_" + fileName;
            string filePath = Path.Combine(uploadDir, fileName);
            Console.WriteLine(uploadDir);
            Console.WriteLine(filePath);
            Console.WriteLine(JsonConvert.SerializeObject(file));
            using (Stream fileStream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(fileStream);
        }

        public async Task SaveUserPhoto(IFormFile file, string fileName)
        {
            await Save(file, "UsersPhotos", fileName);
        }

        public async Task SaveFilePinnedToMessage(IFormFile file, string fileName)
        {
            await Save(file, "FilesPinnedToMessage", fileName);
        }
    }
}
