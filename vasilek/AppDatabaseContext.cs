using vasilek.Models;
using Microsoft.EntityFrameworkCore;

namespace vasilek
{
    public class AppDatabaseContext : DbContext
    {
        public AppDatabaseContext(DbContextOptions<AppDatabaseContext> options) : base(options)
        {

        }

        public DbSet<UserModel>    Users { get; set; }
        public DbSet<PhotoModel>   Photos { get; set; }
        public DbSet<DialogModel>  Dialogs{ get; set; }
        public DbSet<MessageModel> Messages { get; set; }
        public DbSet<FileModel>    Files { get; set; }
    }
}
