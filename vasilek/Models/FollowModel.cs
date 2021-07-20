using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace vasilek.Models
{
    public class FollowModel
    {
        [Key]
        public int Id { get; set; }
        public int SubscriberId { get; set; }
        public virtual UserModel User { get; set; }
    }
}
