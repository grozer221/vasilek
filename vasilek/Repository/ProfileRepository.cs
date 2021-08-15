using Microsoft.EntityFrameworkCore;
using System.Linq;
using vasilek.Models;

namespace vasilek.Repository
{
    public class ProfileRepository
    {
        private readonly AppDatabaseContext _ctx;
        private UserRepository _userRep;
        public ProfileRepository(AppDatabaseContext appDatabaseContext)
        {
            _ctx = appDatabaseContext;
            _userRep = new UserRepository(_ctx);
        }

        public UserModel GetProfileById(int id)
        {
            return _ctx.Users.Find(id);
        }

        public UserModel EditProfileByLogin(string login, UserModel updatedUser)
        {
            UserModel user = _ctx.Users.Include(u => u.Photos).FirstOrDefault(u => u.Login == login);
            user.Login = updatedUser.Login;
            user.NickName = updatedUser.NickName;
            user.Status = updatedUser.Status;
            user.Country = updatedUser.Country;
            _ctx.SaveChanges();
            foreach (var photo in user.Photos)
                photo.User = null;
            return user;
        }

        public UserModel GetProfileByLogin(string login)
        {
            return _ctx.Users.FirstOrDefault(u => u.Login == login);
        }
        
        public UserModel GetProfileWithPhotosByLogin(string login)
        {
            var user = _ctx.Users.Include(u => u.Photos).FirstOrDefault(u => u.Login == login);
            if (user != null && user.Photos != null)
                foreach (var photo in user.Photos)
                    photo.User = null;
            if(user != null)
                user.Password = null;
            return user;
        }
        
        public UserModel GetProfileWithPhotosById(int id)
        {
            var user = _ctx.Users.Include(u => u.Photos).FirstOrDefault(u => u.Id == id);
            foreach (var photo in user.Photos)
                photo.User = null;
            return user;
        }

        public PhotoModel AddPhotoByUserLogin(string login, string photoName)
        {
            UserModel user = _ctx.Users.Include(u => u.Photos).FirstOrDefault(u => u.Login == login);
            if (user == null)
                return null;
            var photo = new PhotoModel { User = user, PhotoName = photoName };
            _ctx.Photos.Add(photo);
            _ctx.SaveChanges();
            photo.User = null;
            return photo;
        }
        
        public bool DeletePhotoByUserLogin(string login, string photoName)
        {
            var photo = _ctx.Photos.Include(p => p.User).FirstOrDefault(u => u.PhotoName == photoName);
            if (photo == null || photo.User.Login != login)
                return false;
            photo.User = null;
            _ctx.Photos.Remove(photo);
            _ctx.SaveChanges();
            return true;
        }

        public void SetAvaPhotoByUserLogin(string login, string photoName)
        {
            _userRep.GetUserByLogin(login).AvaPhoto = photoName;
            _ctx.SaveChanges();
        }


        public bool SetAvaPhotoByLogin(string login, string photoName)
        {
            UserModel user = _ctx.Users.FirstOrDefault(u => u.Login == login);
            if (user == null)
                return false;
            user.AvaPhoto = photoName;
            _ctx.SaveChanges();
            return true;
        }
        
        public bool ChangePasswordByLogin(string login, ChangePassModel changePass)
        {
            UserModel user = _ctx.Users.FirstOrDefault(u => u.Login == login && u.Password == changePass.OldPassword);
            if (user == null)
                return false;
            user.Password = changePass.Password;
            _ctx.SaveChanges();
            return true;
        }

    }
}
