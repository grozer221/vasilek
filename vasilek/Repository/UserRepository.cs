using vasilek.Models;
using System.Collections.Generic;
using System.Linq;

namespace vasilek.Repository
{
    public class UserRepository
    {
        private readonly AppDatabaseContext _ctx;
        public UserRepository(AppDatabaseContext appDatabaseContext)
        {
            _ctx = appDatabaseContext;
        }

        public int GetUserIdByLogin(string login)
        {
            return _ctx.Users.FirstOrDefault(u => u.Login == login).Id;
        }

        public IEnumerable<UserModel> GetUsers(int limit = 5, int offset = 0)
        {
            return _ctx.Users.Select(u => u).Skip(offset).Take(limit).ToList();
        }

        public UserModel GetUserById(int id)
        {
            return _ctx.Users.Find(id);
        }
        
        public UserModel GetUserByLogin(string login)
        {
            return _ctx.Users.FirstOrDefault(u => u.Login == login); ;
        }

        public UserModel AddUser(UserModel user)
        {
            _ctx.Users.Add(user);
            _ctx.SaveChanges();
            return user;
        }

        public UserModel EditUserByLogin(string login, UserModel updatedUser)
        {
            UserModel user = _ctx.Users.FirstOrDefault(u => u.Login == login);
            user.Login = updatedUser.Login;
            user.Password = updatedUser.Password;
            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Photo = updatedUser.Photo;
            user.Photo_small = updatedUser.Photo_small;
            user.City = updatedUser.City;
            user.Country = updatedUser.Country;
            _ctx.SaveChanges();
            return user;
        }

        public IEnumerable<int> GetFollowedUsersByUserId(int userId)
        {
            return _ctx.Follows.Where(f => f.UserId == userId).Select(f => f.SubcriberId);
        }

        public IEnumerable<int> FollowUser(int signatoryId, int subscriberId)
        {
            UserModel userSignatory = _ctx.Users.Find(signatoryId);
            if (userSignatory == null)
                return null;

            if (_ctx.Follows.FirstOrDefault(u => u.UserId == signatoryId && u.SubcriberId == subscriberId) == null)
            {
                _ctx.Follows.Add(new FollowModel()
                {
                    SubcriberId = subscriberId,
                    UserId = signatoryId
                });
                _ctx.SaveChanges();
            }
            return _ctx.Follows.Where(f => f.UserId == signatoryId).Select(f => f.SubcriberId);
        }

        public IEnumerable<int> UnFollowUser(int unSignatoryId, int unSubscriberId)
        {
            UserModel unSignatoryUser = _ctx.Users.Find(unSignatoryId);
            if (unSignatoryUser == null)
                return null;

            FollowModel follow = _ctx.Follows.FirstOrDefault(u => u.UserId == unSignatoryId && u.SubcriberId == unSubscriberId);
            if (follow != null)
            {
                _ctx.Follows.Remove(follow);
                _ctx.SaveChanges();
            }
            return _ctx.Follows.Where(f => f.UserId == unSignatoryId).Select(f => f.SubcriberId);
        }

        public UserModel DeleteUserById(int id)
        {
            UserModel user = _ctx.Users.Find(id);
            _ctx.Users.Remove(user);
            _ctx.SaveChanges();
            return user;
        }
    }
}
