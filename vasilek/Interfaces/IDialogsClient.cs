using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using vasilek.Models;

namespace vasilek.Interfaces
{
    public interface IDialogsClient
    {
        Task ReceiveDialogs(List<DialogModel> dialogModels);
        Task ReceiveMessage(MessageModel messageModel);
        Task ReceiveNotification(MessageModel messageModel);
    }
}
