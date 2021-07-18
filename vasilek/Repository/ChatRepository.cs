using System;
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

        public int AddMessageByUserId(int userId, string messageText)
        {
            if (!_ctx.Users.Any(u => u.Id == userId))
                return 0;
            MessageModel message = new MessageModel()
            {
                UserId = userId,
                MessageText = messageText,
                Date = DateTime.Now.ToString("dd.MM.yyyy"),
                Time = DateTime.Now.ToString("hh:mm:ss")
            };
            _ctx.Messages.Add(message);
            _ctx.SaveChanges();
            return message.Id;
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
                    Id = message.Id,
                    UserId = message.UserId,
                    UserFirstName = sender.FirstName,
                    UserLastName = sender.LastName,
                    AvaPhoto = sender.AvaPhoto,
                    MessageText = message.MessageText,
                    Date = message.Date,
                    Time = message.Time,
                });
            }
            return response.AsQueryable();
        }
    }
}
