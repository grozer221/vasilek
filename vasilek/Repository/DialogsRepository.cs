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

        public DialogModel GetDialogById(int id)
        {
            return _ctx.Dialogs.Include(d => d.Users).SingleOrDefault(d => d.Id == id);
        }

        public List<DialogModel> GetDialogsByUserLogin(string userLogin)
        {
            var currentUser = _ctx.Users
            .Include(u => u.Dialogs).ThenInclude(d => d.Messages).ThenInclude(m => m.User)
            .Include(u => u.Dialogs).ThenInclude(d => d.Users)
            .FirstOrDefault(u => u.Login == userLogin);
            var dialogs = currentUser.Dialogs;
            foreach (var dialog in dialogs)
            {
                if (dialog.Users.Count == 2 && dialog.IsDialogBetween2)
                {
                    List<UserModel> users = dialog.Users;
                    users.Remove(currentUser);
                    dialog.DialogName = users[0].NickName;
                    dialog.DialogPhoto = users[0].AvaPhoto;
                    users.Add(currentUser);
                }
                else if(dialog.DialogName == null)
                    foreach (var user in dialog.Users)
                        dialog.DialogName += user.NickName + ", ";
                    
                foreach (var use in dialog.Users)
                    use.Dialogs = null;
                foreach (var message in dialog.Messages)
                {
                    message.Dialog = null;
                    message.User.Dialogs = null;
                    message.User.Password = null;
                }
            }
            return dialogs;
        }

        public DialogModel GetDialog(string currentUserLogin, int toId)
        {
            var currentUser = _ctx.Users.Include(u => u.Dialogs).ThenInclude(d => d.Users)
                .Include(u => u.Dialogs).ThenInclude(d => d.Messages)
                .FirstOrDefault(u => u.Login == currentUserLogin);
            var currentUserDialogs = currentUser.Dialogs;
            if(currentUserDialogs.Count > 0)
            {
                var dialog = currentUserDialogs.FirstOrDefault(d => d.Users.Count == 2 && d.Users.Any(u => u.Id == toId));
                if (dialog != null)
                    return dialog;
            }
            return null;
        }

        public DialogModel CreateNewDialogBetween2(UserModel author, UserModel user2)
        {
            List<UserModel> users = new List<UserModel>();
            users.Add(author);
            users.Add(user2);
            DialogModel dialog = new DialogModel
            {
                AuthorId = author.Id,
                Users = users,
                DateCreate = DateTime.Now,
                DateChanged = DateTime.Now,
                IsDialogBetween2 = true,
            };
            _ctx.Dialogs.Add(dialog);
            _ctx.SaveChanges();
            return dialog;
        }

        public MessageModel AddMessageToDialog(string currentUserLogin, int dialogId, string messageText)
        {
            UserModel currentUser = _userRep.GetUserByLogin(currentUserLogin);
            DialogModel dialog = _ctx.Dialogs.Include(d => d.Users).Include(d => d.Messages).ThenInclude(m => m.User).FirstOrDefault(d => d.Id == dialogId);
            MessageModel message = new MessageModel
            {
                Dialog = dialog,
                User = currentUser,
                DateCreate = DateTime.Now,
                MessageText = messageText
            };
            dialog.DateChanged = DateTime.Now;
            dialog.Messages.Add(message);
            _ctx.SaveChanges();
            message.Dialog = null;
            message.User.Dialogs = null;
            message.User.Password = null;
            return message;
        }

        public List<string> GetUsersLoginsInDialog(int dialogId)
        {
            var dialog = _ctx.Dialogs.Include(d => d.Users).FirstOrDefault(d => d.Id == dialogId);
            var usersLogins = dialog.Users.Select(u => u.Login).ToList();
            return usersLogins;
        }
        
        public List<UserModel> GetUsersInDialog(int dialogId)
        {
            return _ctx.Dialogs.Include(d => d.Users).FirstOrDefault(d => d.Id == dialogId).Users.ToList();
        }

        public bool DeleteDialog(int dialogId)
        {
            var dialog = _ctx.Dialogs.Include(d => d.Messages).ThenInclude(m => m.User).Include(d => d.Users).FirstOrDefault(d => d.Id == dialogId);
            if (dialog == null)
                return false;
            var messages = dialog.Messages;
            _ctx.Messages.RemoveRange(messages);
            _ctx.Dialogs.Remove(dialog);
            _ctx.SaveChanges();
            return true;
        }

        public DialogModel AddUsersToDialog(DialogModel dialog, int[] usersIds)
        {
            dialog.DateChanged = DateTime.Now;
            if (dialog.IsDialogBetween2)
                dialog.IsDialogBetween2 = false;
            var usersInDialog = dialog.Users;
            List<int> usersIdsList = usersIds.ToList();
            foreach (int userId in usersIdsList)
                usersInDialog.Add(_userRep.GetUserById(userId));
            _ctx.SaveChanges();
            return dialog;
        }
        
        public DialogModel RemoveUserFromDialog(DialogModel dialog, UserModel user)
        {
            var usersInDialog = dialog.Users;
            usersInDialog.Remove(user);
            _ctx.SaveChanges();
            return dialog;
        }
        
        public void ChangeGroupName(DialogModel dialog, string newGroupName)
        {
            dialog.DialogName = newGroupName;
            _ctx.SaveChanges();
        }
    }
}
