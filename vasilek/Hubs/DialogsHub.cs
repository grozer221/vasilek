using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using vasilek.Interfaces;
using vasilek.Models;
using vasilek.Repository;

namespace vasilek.Hubs
{
    [Authorize]
    public class DialogsHub : Hub<IDialogsClient>
    {
        private AppDatabaseContext _ctx;
        private DialogsRepository _dialogsRep;
        private UserRepository _userRep;

        public DialogsHub(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _dialogsRep = new DialogsRepository(_ctx);
            _userRep = new UserRepository(ctx);
        }

        public async Task SendMessage(int dialogId, string messageText)
        {
            MessageModel message = _dialogsRep.AddMessageToDialog(Context.User.Identity.Name, dialogId, messageText);
            var usersLogins = _dialogsRep.GetUsersLoginsInDialog(dialogId);
            await Clients.Users(usersLogins).ReceiveMessage(dialogId, message);
            usersLogins.Remove(Context.User.Identity.Name);
            await Clients.Users(usersLogins).ReceiveNotification(message);
        }

        public async Task GetDialogByUserId(int userId)
        {
            var currentUser = _userRep.GetUserByLogin(Context.User.Identity.Name);
            DialogModel dialog = _dialogsRep.GetDialog(Context.User.Identity.Name, userId);
            if(dialog != null)
            {
                foreach (var user in dialog.Users)
                    user.Dialogs = null;
                if (dialog.Users.Count <= 2)
                {
                    List<UserModel> users = dialog.Users;
                    users.Remove(currentUser);
                    dialog.DialogName = users[0].NickName;
                    dialog.DialogPhoto = users[0].AvaPhoto;
                    users.Add(currentUser);
                }
                else
                    foreach (var user in dialog.Users)
                        dialog.DialogName += user.NickName + ", ";
                await Clients.Caller.ReceiveDialogId(dialog.Id);
                await Clients.Caller.SetCurrentDialogId(dialog.Id);
            }
            else
            {
                dialog = _dialogsRep.CreateNewDialog(currentUser, _userRep.GetUserById(userId));

                var usersLogins = _dialogsRep.GetUsersLoginsInDialog(dialog.Id);
                foreach (string userLogin in usersLogins)
                {
                    var user = _userRep.GetUserByLogin(userLogin);
                    if (dialog.Users.Count <= 2)
                    {
                        List<UserModel> users = dialog.Users;
                        users.Remove(user);
                        dialog.DialogName = users[0].NickName;
                        dialog.DialogPhoto = users[0].AvaPhoto;
                        users.Add(user);
                    }
                    else
                        foreach (var use in dialog.Users)
                            dialog.DialogName += use.NickName + ", ";
                    foreach (var use in dialog.Users)
                        use.Dialogs = null;
                    await Clients.User(userLogin).ReceiveDialog(dialog);
                }
                await Clients.Caller.SetCurrentDialogId(dialog.Id);
            }

        }

        public async Task DeleteDialog(int dialogId)
        {
            var usersLogins = _dialogsRep.GetUsersLoginsInDialog(dialogId);
            if (_dialogsRep.DeleteDialog(dialogId))
                await Clients.Users(usersLogins).DeleteDialog(dialogId);
        }

        public override async Task OnConnectedAsync()
        {
            var dialogs = _dialogsRep.GetDialogsByUserLogin(Context.User.Identity.Name);
            await Clients.Caller.ReceiveDialogs(dialogs);
            await base.OnConnectedAsync();
        }
    }
}
