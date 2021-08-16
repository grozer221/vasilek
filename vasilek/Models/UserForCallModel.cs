namespace vasilek.Models
{
    public class UserForCallModel: UserModel
    {
        public string CallStatus { get; set; } = "pending";
        public bool IsOnVideo { get; set; } = false;
        public bool IsOnAudio { get; set; } = true;
    }
}
