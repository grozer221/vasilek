using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
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
    public class ChatHub : Hub<IChatClient>
    {
        private AppDatabaseContext _ctx;
        private ChatRepository _chatRep;
        private UserRepository _userRep;
        public ChatHub(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _chatRep = new ChatRepository(_ctx);
            _userRep = new UserRepository(ctx);
        }
        public async Task SendMessage(string messageText)
        {
            UserModel sender = _userRep.GetUserByLogin(Context.User.Identity.Name);
            int messageId = 0;// _chatRep.AddMessageByUserId(sender.Id, messageText);
            await Clients.Caller.ReceiveMessage(new List<ResponseChatModel>() 
            {
                new ResponseChatModel()
                {
                    Id = messageId,
                    UserId = sender.Id,
                    UserNickName = "You",
                    AvaPhoto = sender.AvaPhoto,
                    MessageText = messageText,
                    Date = DateTime.Now.ToString("dd:MM:yyyy"),
                    Time = DateTime.Now.ToString("hh:mm:ss")
                }
            });
            await Clients.Others.ReceiveMessage(new List<ResponseChatModel>()
            {
                new ResponseChatModel()
                {
                    Id = messageId,
                    UserId = sender.Id,
                    UserNickName = sender.NickName,
                    AvaPhoto = sender.AvaPhoto,
                    MessageText = messageText,
                    Date = DateTime.Now.ToString("dd:MM:yyyy"),
                    Time = DateTime.Now.ToString("hh:mm:ss")
                }

            });
            await Clients.Others.ReceiveNotification(new List<ResponseChatModel>()
            {
                new ResponseChatModel()
                {
                    Id = messageId,
                    UserId = sender.Id,
                    UserNickName = sender.NickName,
                    AvaPhoto = sender.AvaPhoto,
                    MessageText = messageText,
                    Date = DateTime.Now.ToString("dd:MM:yyyy"),
                    Time = DateTime.Now.ToString("hh:mm:ss")
                }
            });
        }

        public override async Task OnConnectedAsync()
        {
            //await Clients.Caller.ReceiveMessage(_chatRep.GetAllMessages(Context.User.Identity.Name).ToList());
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {

        }
    }
}
