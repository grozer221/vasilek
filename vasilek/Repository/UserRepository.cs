using vasilek.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

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
            foreach (var photo in user.Photos)
                photo.User = null;
            return user;
        }



        public IQueryable<UserModel> GetUsersByLogin(string login, ref int usersCount, int limit = 5, int offset = 0)
        {
            List<UserModel> currentUser = new List<UserModel>();
            currentUser.Add(_ctx.Users.Include(u => u.Follows).FirstOrDefault(u => u.Login == login));
            List<UserModel> users = _ctx.Users.Select(u => u).ToList();
            if (currentUser[0] != null)
                users = users.Except(currentUser).ToList();
            usersCount = users.Count();
            users = users.Skip(offset).Take(limit).ToList();
            if(currentUser[0] != null)
            {
                foreach (var user in users)
                    if (currentUser[0].Follows.Any(f => f.SubscriberId == user.Id))
                        user.IsFollowed = true;
            }
            return users.AsQueryable();
        }

        public IQueryable<UserModel> GetUsersWithTermByLogin(string login, string term, ref int usersCount, int limit = 5, int offset = 0)
        {
            List<UserModel> currentUser = new List<UserModel>();
            currentUser.Add(_ctx.Users.Include(u => u.Follows).FirstOrDefault(u => u.Login == login));
            List<UserModel> users = _ctx.Users.Where(u => EF.Functions.Like(u.NickName, $"%{term}%")).ToList();
            if (currentUser[0] != null)
                users = users.Except(currentUser).ToList();
            usersCount = users.Count();
            users = users.Skip(offset).Take(limit).ToList();
            if (currentUser[0] != null)
            {
                foreach (var user in users)
                    if (currentUser[0].Follows.Any(f => f.SubscriberId == user.Id))
                        user.IsFollowed = true;
            }
            return users.AsQueryable();
        }

        [Authorize]
        public IQueryable<UserModel> GetFriends(int userId, ref int friendsCount, int limit = 5, int offset = 0)
        {
            List<int> friendsIds = _ctx.Users.Include(u => u.Follows).FirstOrDefault(u => u.Id == userId).Follows.Select(f => f.SubscriberId).ToList();
            List<UserModel> friends = _ctx.Users.Where(u => friendsIds.Contains(u.Id)).ToList();
            foreach (var friend in friends)
                friend.IsFollowed = true;
            friendsCount = friends.Count();
            return friends.Skip(offset).Take(limit).AsQueryable();
        }
        
        [Authorize]
        public IQueryable<UserModel> GetFriendsWithTerm(int userId, string term, ref int friendsCount, int limit = 5, int offset = 0)
        {
            List<int> friendsIds = _ctx.Users.Include(u => u.Follows).FirstOrDefault(u => u.Id == userId).Follows.Select(f => f.SubscriberId).ToList();
            List<UserModel> friends = _ctx.Users
                .Where(u => friendsIds.Contains(u.Id) 
                && EF.Functions.Like(_ctx.Users.Include(u2 => u2.Follows)
                .FirstOrDefault(u3 => u3.Id == u.Id).NickName, $"%{term}%")).ToList();
            foreach (var friend in friends)
                friend.IsFollowed = true;
            friendsCount = friends.Count();
            return friends.Skip(offset).Take(limit).AsQueryable();
        }



        public UserModel AddUser(UserModel user)
        {
            _ctx.Users.Add(user);
            _ctx.SaveChanges();
            return user;
        }

        public bool FollowUser(int senderId, int subscriberId)
        {
            UserModel sender = _ctx.Users.Include(u => u.Follows).FirstOrDefault(u => u.Id == senderId);

            if (sender == null)
                return false;
            sender.Follows.Add(new FollowModel 
            { 
                User = sender,
                SubscriberId = subscriberId
            });
            _ctx.SaveChanges();
            return true;
        }

        public bool UnFollowUser(int unSignatoryId, int unSubscriberId)
        {
            UserModel signatory = _ctx.Users.Include(u => u.Follows).FirstOrDefault(u => u.Id == unSignatoryId);
            FollowModel follow = signatory.Follows.FirstOrDefault(f => f.SubscriberId == unSubscriberId);


            if (signatory == null || follow == null)
                return false;
            _ctx.Follows.Remove(follow);
            _ctx.SaveChanges();
            return true;
        }

        public int GetUsersCount()
        {
            return _ctx.Users.Count();
        }

        

        //public UserModel DeleteUserById(int id)
        //{
        //    UserModel user = _ctx.Users.Find(id);
        //    _ctx.Users.Remove(user);
        //    _ctx.SaveChanges();
        //    return user;
        //}


    }
}
