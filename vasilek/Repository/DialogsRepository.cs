using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using vasilek.Models;

namespace vasilek.Repository
{
    public class DialogsRepository
    {
        private readonly AppDatabaseContext _ctx;
        private UserRepository _userRep;
        public DialogsRepository(AppDatabaseContext appDatabaseContext)
        {
            _ctx = appDatabaseContext;
            _userRep = new UserRepository(_ctx);
        }

        public bool CreateDialogByUsersIds(int authorId, int recipientId)
        {
            var users = _ctx.Users.Include(u => u.Dialogs).ThenInclude(d => d.Users);
            var author = users.FirstOrDefault(u => u.Id == authorId);
            var recipient = users.FirstOrDefault(u => u.Id == recipientId);
            author.Dialogs.Add(new DialogModel
            {
                AuthorId = authorId,
                Users = new List<UserModel> { recipient },
                DateCreate = DateTime.Now
            });
            return true;
        }

        public List<DialogModel> GetDialogsByUserLogin(int userLogin)
        {
            var users = _ctx.Users.Include(u => u.Dialogs).ThenInclude(d => d.Users);
            var user = users.FirstOrDefault(u => u.Id == userLogin);
            return user.Dialogs.Select(d => d).ToList();
        }

        //public DialogModel GetDialogByUsersIds(int currentUserId, int otherUserId)
        //{
        //    var users = _ctx.Users.Include(u => u.Dialogs).ThenInclude(d => d.Users);
        //    var currentUser = users.FirstOrDefault(u => u.Id == currentUserId);
        //    var otherUser = users.FirstOrDefault(u => u.Id == otherUserId);
        //    if (currentUser.Dialogs.Any(d => d.Users.Any(u => u == otherUser)) || otherUser.Dialogs.Any(d => d.Users.Any(u => u == currentUser)))
        //    {

        //    }
        //    else
        //    {
        //        CreateDialogByUsersIds(currentUserId, otherUserId);
        //        return null;
        //    }

        //    return new DialogModel();
        //}
    }
}
