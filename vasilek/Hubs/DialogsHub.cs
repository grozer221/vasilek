using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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

        public async Task SendMessage(int dialogId, string messageText, FileModel[] files)
        {
            int messageId = _dialogsRep.AddMessageToDialog(Context.User.Identity.Name, dialogId, messageText);
            MessageModel message = _dialogsRep.AddFilesPinnedToMessage(messageId, files);
            var usersLogins = message.Dialog.Users.Select(u => u.Login).ToList();
            message.Dialog.Users = null;
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
                if (dialog.Users.Count <= 2 && dialog.IsDialogBetween2)
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
                dialog = _dialogsRep.CreateNewDialogBetween2(currentUser, _userRep.GetUserById(userId));
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
            var currentUser = _userRep.GetUserByLogin(Context.User.Identity.Name);
            var dialog = _dialogsRep.GetDialogById(dialogId);
            if(dialog.Users.Any(u => u == currentUser))
            {
                var usersLogins = dialog.Users.Select(u => u.Login).ToList();
                _dialogsRep.DeleteDialog(dialogId);
                await Clients.Users(usersLogins).DeleteDialog(dialogId);
            }
        }
        
        public async Task AddUsersToDialog(int dialogId, int[] usersIds)
        {
            var currentUser = _userRep.GetUserByLogin(Context.User.Identity.Name);
            var dialog = _dialogsRep.GetDialogById(dialogId);
            if(dialog.Users.Any(u => u == currentUser))
            {
                _dialogsRep.AddUsersToDialog(dialog, usersIds);
                var usersInDialog = dialog.Users;
                await Clients.Caller.AddUsersToDialog(dialogId, usersInDialog);
                var usersLoginsInDialog = usersInDialog.Select(u => u.Login).ToList();
                usersLoginsInDialog.Remove(Context.User.Identity.Name);
                await Clients.Users(usersLoginsInDialog).ReceiveDialog(dialog);
            }
        }
        
        public async Task RemoveUserFromDialog(int dialogId, int userId)
        {
            var user = _userRep.GetUserById(userId);
            var dialog = _dialogsRep.GetDialogById(dialogId);
            if (dialog.AuthorId != _userRep.GetUserIdByLogin(Context.User.Identity.Name))
                return;
            _dialogsRep.RemoveUserFromDialog(dialog, user);
            var usersInDialog = dialog.Users;
            var usersLoginsInDialog = usersInDialog.Select(u => u.Login).ToList();
            await Clients.User(user.Login).RemoveDialog(dialogId);
            await Clients.Users(usersLoginsInDialog).RemoveUserFromDialog(dialogId, userId);
        }
        
        public async Task ChangeGroupName(int dialogId, string newGroupName)
        {
            var dialog = _dialogsRep.GetDialogById(dialogId);
            var currentUser = _userRep.GetUserByLogin(Context.User.Identity.Name);
            if (dialog.IsDialogBetween2 || !dialog.Users.Any(u => u == currentUser))
                return;
            _dialogsRep.ChangeGroupName(dialog, newGroupName);
            var usersLoginsInDialog = dialog.Users.Select(u => u.Login).ToList();
            await Clients.Users(usersLoginsInDialog).ChangeGroupName(dialogId, newGroupName);
        }
        
        public async Task MakeMessageRead(int dialogId, int messageId)
        {
            string userLogin = Context.User.Identity.Name;
            _dialogsRep.MakeMessageRead(messageId, userLogin);
            var userLoginInDialog = _dialogsRep.GetUsersLoginsInDialog(dialogId);
            await Clients.Users(userLoginInDialog).MakeMessageRead(dialogId, messageId, userLogin);
        }
        
        ////
        public async Task CallToDialog(int dialogId, List<UserForCallModel> users)
        {
            var currentUserLogin = Context.User.Identity.Name;
            foreach (var user in users)
            {
                if(user.Login == currentUserLogin)
                {
                    user.CallStatus = "accepted";
                    user.IsOnAudio = true;
                    user.IsOnVideo = false;
                }
                else
                {
                    user.CallStatus = "pending";
                    user.IsOnAudio = true;
                    user.IsOnVideo = false;
                }
            }
            var usersLoginsInDialog = users.Select(u => u.Login).ToList();
            await Clients.Users(usersLoginsInDialog).SetUsersInCall(users);
            usersLoginsInDialog.Remove(currentUserLogin);
            await Clients.Users(usersLoginsInDialog).ReceiveCall(dialogId);
        }

        public async Task SendMySignal(int dialogId, object signal)
        {
            var usersInDialogExeptMe = _dialogsRep.GetUsersInDialogExeptUser(dialogId, Context.User.Identity.Name).Select(u => u.Login);
            await Clients.Users(usersInDialogExeptMe).ReceiveSignal(signal);
        }
        
        public async Task AcceptCall(int dialogId)
        {
            var usersInDialog = _dialogsRep.GetUsersInDialog(dialogId).Select(u => u.Login);
            var user = _userRep.GetUserByLogin(Context.User.Identity.Name);
            await Clients.Users(usersInDialog).ChangeCallStatusOn(Context.User.Identity.Name, "accepted");
        }
        
        public async Task LeaveCall(int dialogId)
        {
            var usersInDialog = _dialogsRep.GetUsersInDialog(dialogId).Select(u => u.Login);
            await Clients.Users(usersInDialog).ChangeCallStatusOn(Context.User.Identity.Name, "declined");
        }

        public async Task EndCall(int dialogId)
        {
            var usersInDialog = _dialogsRep.GetUsersInDialog(dialogId).Select(u => u.Login);
            await Clients.Users(usersInDialog).EndCall();
        }

        ////

        public override async Task OnConnectedAsync()
        {
            DateTime dateLastOnline = _dialogsRep.MakeUserOnline(Context.User.Identity.Name);
            var dialogs = _dialogsRep.GetDialogsByUserLogin(Context.User.Identity.Name);
            await Clients.Caller.ReceiveDialogs(dialogs);
            var usersLogins = _dialogsRep.GetUsersLoginsInDialogsExeptUser(dialogs, Context.User.Identity.Name);
            await Clients.Users(usersLogins).ToggleUserOnline(Context.User.Identity.Name, true);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            DateTime dateLastOnline = _dialogsRep.MakeUserOffline(Context.User.Identity.Name);
            var dialogs = _dialogsRep.GetDialogsByUserLogin(Context.User.Identity.Name);
            var usersLogins = _dialogsRep.GetUsersLoginsInDialogsExeptUser(dialogs, Context.User.Identity.Name);
            await Clients.Users(usersLogins).ToggleUserOnline(Context.User.Identity.Name, false);
            await Clients.Users(usersLogins).SetDateLastOnline(Context.User.Identity.Name, dateLastOnline);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
