using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace vasilek.Models
{
    public class UserModel
    {   
        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string NickName { get; set; }
        public string Status { get; set; }
        public string Country { get; set; }
        public string AvaPhoto { get; set; }
        public bool IsOnline { get; set; }
        public DateTime DateLastOnline { get; set; }
        public DateTime DateRegister { get; set; }
        public virtual List<PhotoModel> Photos { get; set; }
        public virtual List<DialogModel> Dialogs { get; set; }
    }
}
