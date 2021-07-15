using System.Linq;

namespace vasilek.Models
{
    public class ResponseUserModel
    {
        public IQueryable<UserModel> Users;
        public int Count;
    }
}
