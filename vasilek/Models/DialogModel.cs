using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace vasilek.Models
{
    public class DialogModel
    {
        [Key]
        public int Id { get; set; }
        public int AuthorId { get; set; }
        public string DialogName { get; set; }
        public string DialogPhoto { get; set; }
        public bool IsDialogBetween2 { get; set; }
        public virtual List<UserModel> Users { get; set; }
        public virtual List<MessageModel> Messages { get; set; }
        public DateTime DateCreate { get; set; }
        public DateTime DateChanged { get; set; }
    }
}
