using System.Linq;
using vasilek.Models;

namespace vasilek.Repository
{
    public class ProfileRepository
    {
        private readonly AppDatabaseContext _ctx;
        public ProfileRepository(AppDatabaseContext appDatabaseContext)
        {
            _ctx = appDatabaseContext;
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
            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
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

        public bool AddPhotoByUserId(int userId, string photoName)
        {
            UserModel user = _ctx.Users.Find(userId);
            if (user == null)
                return false;
            _ctx.Photos.Add(new PhotoModel()
            {
                Name = photoName,
                UserId = userId
            });
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
