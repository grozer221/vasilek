using System.Linq;
using System.Threading.Tasks;
using vasilek.Models;

namespace vasilek.Interfaces
{
    public interface IChatClient
    {
        Task ReceiveMessage(ResponseChatModel message);
    }
}
