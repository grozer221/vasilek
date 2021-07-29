using System.ComponentModel.DataAnnotations;

namespace vasilek.Models
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Not entered Login")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Not entered Password")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Password entered wrong")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Not entered NickName")]
        public string NickName { get; set; }
    }
}
