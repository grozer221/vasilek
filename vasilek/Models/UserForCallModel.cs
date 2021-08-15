namespace vasilek.Models
{
    public class UserForCallModel: UserModel
    {
        public string CallStatus { get; set; }
        public bool IsOnVideo { get; set; }
        public bool IsOnAudio { get; set; }
    }
}
