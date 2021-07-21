using System;

namespace vasilek.Models
{
    public class MessageModel
    {
        public int Id { get; set; }
        public virtual DialogModel Dialog { get; set; }
        public virtual UserModel User { get; set; }
        public string MessageText { get; set; }
        public DateTime DateCreate { get; set; }
    }
}
