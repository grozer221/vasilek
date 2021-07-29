using System.ComponentModel.DataAnnotations;

namespace vasilek.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Not entered Login")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Not entered Password")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
