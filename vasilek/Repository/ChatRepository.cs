using System.Collections.Generic;
using System.Linq;
using vasilek.Models;

namespace vasilek.Repository
{
    public class ChatRepository
    {
        private readonly AppDatabaseContext _ctx;
        private UserRepository _userRep;
        public ChatRepository(AppDatabaseContext appDatabaseContext)
        {
            _ctx = appDatabaseContext;
            _userRep = new UserRepository(_ctx);
        }

        public bool AddMessageByUserId(int userId, string messageText)
        {
            if (userId == null)
                return false;
            _ctx.Messages.Add(new MessageModel()
            {
                UserId = userId,
                MessageText = messageText,
            });
            _ctx.SaveChanges();
            return true;
        }

        public IQueryable<ResponseChatModel> GetAllMessages(string currentUserLogin)
        {
            List<MessageModel> messages = _ctx.Messages.Select(m => m).ToList();
            List<ResponseChatModel> response = new List<ResponseChatModel>();
            foreach (var message in messages)
            {
                UserModel sender = _userRep.GetUserById(message.UserId);
                if (currentUserLogin == sender.Login)
                {
                    sender.FirstName = "You";
                    sender.LastName = "";
                }
                response.Add(new ResponseChatModel()
                {
                    UserId = message.UserId,
                    UserFirstName = sender.FirstName,
                    UserLastName = sender.LastName,
                    AvaPhoto = sender.AvaPhoto,
                    MessageText = message.MessageText
                });
            }
            return response.AsQueryable();
        }
    }
}
