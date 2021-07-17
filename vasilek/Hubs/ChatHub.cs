using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
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
        public async Task SendMessage(RequestChatModel request)
        {
            _chatRep.AddMessage(request);
            UserModel sender = _userRep.GetUserById(request.UserId);
            await Clients.Caller.ReceiveMessage(new ResponseChatModel() 
            {
                UserId = request.UserId,
                UserFirstName = "You",
                UserLastName = "",
                AvaPhoto = sender.AvaPhoto,
                MessageText = request.MessageText,
            });
            await Clients.Others.ReceiveMessage(new ResponseChatModel() 
            {
                UserId = request.UserId,
                UserFirstName = sender.FirstName,
                UserLastName = sender.LastName,
                AvaPhoto = sender.AvaPhoto,
                MessageText = request.MessageText,
            });
        }
    }
}
