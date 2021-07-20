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

        public bool UpdateStatusByLogin(string login, string status)
        {
            UserModel user = _ctx.Users.FirstOrDefault(u => u.Login == login);
            if (user == null)
                return false;
            user.Status = status;
            _ctx.SaveChanges();
            return true;
        }

        public UserModel EditProfileByLogin(string login, UserModel updatedUser)
        {
            UserModel user = _ctx.Users.FirstOrDefault(u => u.Login == login);
            user.Login = updatedUser.Login;
            user.Password = updatedUser.Password;
            user.NickName = updatedUser.NickName;
            user.Photos = updatedUser.Photos;
            user.City = updatedUser.City;
            user.Country = updatedUser.Country;
            _ctx.SaveChanges();
            return user;
        }

        public UserModel GetProfileByLogin(string login)
        {
            return _ctx.Users.FirstOrDefault(u => u.Login == login);
        }

        public bool AddPhotoByUserLogin(string login, string photoName)
        {
            UserModel user = _ctx.Users.Include(u => u.Photos).FirstOrDefault(u => u.Login == login);
            if (user == null)
                return false;
            user.Photos.Add(new PhotoModel() { PhotoName = photoName });
            _ctx.SaveChanges();
            return true;
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

    }
}
