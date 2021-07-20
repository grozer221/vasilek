using System;

namespace vasilek.Models
{
    public class ResponseChatModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserNickName { get; set; }
        public string AvaPhoto { get; set; }
        public string MessageText { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
    }
}
