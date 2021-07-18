using System;

namespace vasilek.Models
{
    public class MessageModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string MessageText { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public virtual UserModel User { get; set; }
    }
}
