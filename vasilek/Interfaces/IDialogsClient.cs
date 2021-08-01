using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using vasilek.Models;

namespace vasilek.Interfaces
{
    public interface IDialogsClient
    {
        Task ReceiveDialogs(List<DialogModel> dialogModels);
        Task ReceiveDialog(DialogModel dialog);
        Task ReceiveDialogId(int id);
        Task ReceiveMessage(int dialogId, MessageModel messageModel);
        Task ReceiveNotification(MessageModel messageModel);
        Task SetCurrentDialogId(int id);
        Task DeleteDialog(int dialogId);
        Task AddUsersToDialog(int dialogId, List<UserModel> usersInDialog);
        Task RemoveDialog(int dialogId);
        Task RemoveUserFromDialog(int dialogId, int userId);
    }
}
