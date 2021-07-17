using System.Linq;
using vasilek.Models;

namespace vasilek.Repository
{
    public class ChatRepository
    {
        private readonly AppDatabaseContext _ctx;
        public ChatRepository(AppDatabaseContext appDatabaseContext)
        {
            _ctx = appDatabaseContext;
        }

        public bool AddMessage(RequestChatModel request)
        {
            UserModel user = _ctx.Users.Find(request.UserId);
            if (user == null)
                return false;
            _ctx.Messages.Add(new MessageModel()
            {
                UserId = request.UserId,
                MessageText = request.MessageText,
            });
            _ctx.SaveChanges();
            return true;
        }

        public IQueryable<MessageModel> GetAllMessage()
        {
            return _ctx.Messages.Select(m => m);
        }
    }
}
