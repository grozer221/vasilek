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



        public IQueryable<UserModel> GetUsers(int limit = 5, int offset = 0)
        {
            return _ctx.Users.Select(u => u).Skip(offset).Take(limit);
        }

        public IQueryable<UserModel> GetUsersWithTerm(string term, ref int usersCount, int limit = 5, int offset = 0)
        {
            List<UserModel> users = _ctx.Users.Where(u => EF.Functions.Like(u.FirstName, $"%{term}%") || EF.Functions.Like(u.LastName, $"%{term}%")).Skip(offset).Take(limit).ToList();
            usersCount = users.Count;
            return users.AsQueryable();
        }

        [Authorize]
        public IQueryable<UserModel> GetFriends(int userId, ref int friendsCount, int limit = 5, int offset = 0)
        {
            List<int> friendsId = _ctx.Follows.Where(f => f.UserId == userId).Skip(offset).Take(limit).Select(f => f.SubcriberId).ToList();
            friendsCount = _ctx.Follows.Where(f => f.UserId == userId).Count();
            List<UserModel> friends = new List<UserModel>();
            foreach (int friendId in friendsId)
                friends.Add(_ctx.Users.Find(friendId));
            return friends.AsQueryable();
        }
        
        [Authorize]
        public IQueryable<UserModel> GetFriendsWithTerm(int userId, string term, ref int friendsCount, int limit = 5, int offset = 0)
        {
            List<int> friendsId = _ctx.Follows.Where(f => f.UserId == userId).Skip(offset).Take(limit).Select(f => f.SubcriberId).ToList();
            friendsCount = _ctx.Follows.Where(f => f.UserId == userId).Count();
            List<UserModel> friends = new List<UserModel>();
            foreach (int friendId in friendsId)
            {
                UserModel user = _ctx.Users.FirstOrDefault(u => u.Id == friendId && (EF.Functions.Like(u.FirstName, $"%{term}%") || EF.Functions.Like(u.LastName, $"%{term}%")));
                if(user!= null)
                    friends.Add(user);
            }
            return friends.AsQueryable();
        }



        public UserModel AddUser(UserModel user)
        {
            _ctx.Users.Add(user);
            _ctx.SaveChanges();
            return user;
        }

        public IQueryable<int> GetFollowedUsersByUserId(int userId)
        {
            return _ctx.Follows.Where(f => f.UserId == userId).Select(f => f.SubcriberId);
        }

        public IQueryable<int> FollowUser(int signatoryId, int subscriberId)
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

        public IQueryable<int> UnFollowUser(int unSignatoryId, int unSubscriberId)
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
