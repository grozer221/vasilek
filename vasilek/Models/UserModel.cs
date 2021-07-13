﻿using System.Collections.Generic;

namespace vasilek.Models
{
    public class UserModel
    {       
        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Status { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string AvaPhoto { get; set; }
        public virtual ICollection<PhotoModel> Photos { get; set; }
        public virtual ICollection<FollowModel> Follows { get; set; }
    }
}
