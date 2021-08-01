using vasilek.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace vasilek.Repository
{
    [Authorize]
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

        public UserModel GetUserByLogin(string login)
        {
            return _ctx.Users.FirstOrDefault(u => u.Login == login);
        }

        public UserModel GetUserById(int id)
        {
            return _ctx.Users.Find(id);
        }
        
        public UserModel GetUserWithPhotosByLoginAndPass(string login, string password)
        {
            var user = _ctx.Users.Include(u => u.Photos).FirstOrDefault(u => u.Login == login && u.Password == password);
            if (user == null)
                return null;
            foreach (var photo in user.Photos)
                photo.User = null;
            return user;
        }

        public IQueryable<UserModel> GetUsersByLogin(string login, ref int usersCount, int limit = 5, int offset = 0)
        {
            List<UserModel> currentUser = new List<UserModel>();
            currentUser.Add(GetUserByLogin(login));
            List<UserModel> users = _ctx.Users.Select(u => u).ToList();
            if (currentUser[0] != null)
                users = users.Except(currentUser).ToList();
            usersCount = users.Count();
            users = users.Skip(offset).Take(limit).ToList();
            return users.AsQueryable();
        }

        public IQueryable<UserModel> GetUsersWithTermByLogin(string login, string term, ref int usersCount, int limit = 5, int offset = 0)
        {
            List<UserModel> currentUser = new List<UserModel>();
            currentUser.Add(GetUserByLogin(login));
            List<UserModel> users = _ctx.Users.Where(u => EF.Functions.Like(u.NickName, $"%{term}%")).ToList();
            if (currentUser[0] != null)
                users = users.Except(currentUser).ToList();
            usersCount = users.Count();
            users = users.Skip(offset).Take(limit).ToList();
            return users.AsQueryable();
        }

        public UserModel AddUser(UserModel user)
        {
            _ctx.Users.Add(user);
            _ctx.SaveChanges();
            return user;
        }

        public int GetUsersCount()
        {
            return _ctx.Users.Count();
        }
    }
}
