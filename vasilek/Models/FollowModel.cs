namespace vasilek.Models
{
    public class FollowModel
    {
        public int Id { get; set; }
        public int SubcriberId { get; set; }
        public bool Followed { get; set; }
        public int UserId { get; set; }
        public virtual UserModel User { get; set; }
    }
}
