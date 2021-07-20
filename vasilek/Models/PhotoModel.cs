using System.ComponentModel.DataAnnotations;

namespace vasilek.Models
{
    public class PhotoModel
    {
        [Key]
        public int Id { get; set; }
        public string PhotoName { get; set; }
        public virtual UserModel User { get; set; }
    }
}
