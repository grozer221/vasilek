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

        //public bool CreateDialogByUsersIds(int authorId, int recipientId)
        //{
        //    var users = _ctx.Users.Include(u => u.Dialogs).ThenInclude(d => d.Users);
        //    var author = users.FirstOrDefault(u => u.Id == authorId);
        //    var recipient = users.FirstOrDefault(u => u.Id == recipientId);
        //    author.Dialogs.Add(new DialogModel
        //    {
        //        AuthorId = authorId,
        //        Users = new List<UserModel> { recipient },
        //        DateCreate = DateTime.Now
        //    });
        //    return true;
        //}

        public List<DialogModel> GetDialogsByUserLogin(string userLogin)
        {
            var user = _ctx.Users
            .Include(u => u.Dialogs).ThenInclude(d => d.Messages)
            .Include(u => u.Dialogs).ThenInclude(d => d.Users)
            .FirstOrDefault(u => u.Login == userLogin);
            var dialogs = user.Dialogs;
            foreach (var dialog in dialogs)
            {
                if (dialog.Users.Count <= 2)
                {
                    List<UserModel> users = dialog.Users;
                    users.Remove(user);
                    dialog.DialogName = users[0].NickName;
                }
                else
                    foreach (var user1 in dialog.Users)
                        dialog.DialogName += user1.NickName + ", "; 
                foreach (var use in dialog.Users)
                    use.Dialogs = null;
                foreach (var message in dialog.Messages)
                    message.Dialog = null;
            }
            return dialogs;
        }

        public int? WriteTo(string currentUserLogin, int toId)
        {
            var currentUser = _ctx.Users.Include(u => u.Dialogs).ThenInclude(d => d.Users).FirstOrDefault(u => u.Login == currentUserLogin);
            var currentUserDialogs = currentUser.Dialogs;
            if(currentUserDialogs.Count > 0)
            {
                int? dialogId = currentUserDialogs?.FirstOrDefault(d => d.Users.Count == 2 && d.Users.Any(u => u.Id == toId)).Id;
                if (dialogId != null)
                    return dialogId;
            }
            return CreateNewDialog(currentUserLogin, _userRep.GetUserByLogin(currentUserLogin), _userRep.GetUserById(toId));
        }

        private int CreateNewDialog(string authorLogin, UserModel user1, UserModel user2)
        {
            List<UserModel> users = new List<UserModel>();
            users.Add(user1);
            users.Add(user2);
            DialogModel dialog = new DialogModel
            {
                AuthorId = _userRep.GetUserIdByLogin(authorLogin),
                Users = users,
                DateCreate = DateTime.Now,
            };
            _ctx.Dialogs.Add(dialog);
            _ctx.SaveChanges();
            return dialog.Id;
        }

    }
}
