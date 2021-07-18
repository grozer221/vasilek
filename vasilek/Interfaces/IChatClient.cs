using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using vasilek.Models;

namespace vasilek.Interfaces
{
    public interface IChatClient
    {
        Task ReceiveMessage(List<ResponseChatModel> messages);
        Task ReceiveNotification(List<ResponseChatModel> messages);
    }
}
