using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Linq;
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
            _chatRep.AddMessageByUserId(sender.Id, messageText);
            await Clients.Caller.ReceiveMessage(new ResponseChatModel() 
            {
                UserId = sender.Id,
                UserFirstName = "You",
                UserLastName = "",
                AvaPhoto = sender.AvaPhoto,
                MessageText = messageText,
            });
            await Clients.Others.ReceiveMessage(new ResponseChatModel() 
            {
                UserId = sender.Id,
                UserFirstName = sender.FirstName,
                UserLastName = sender.LastName,
                AvaPhoto = sender.AvaPhoto,
                MessageText = messageText,
            });
        }
        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.OnConnected(_chatRep.GetAllMessages(Context.User.Identity.Name));
        }
    }
}
