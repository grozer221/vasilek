namespace vasilek.Models
{
    public class PhotoModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int UserId { get; set; }
        public virtual UserModel User { get; set; }
    }
}
