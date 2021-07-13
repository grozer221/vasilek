using vasilek.Models;
using Microsoft.EntityFrameworkCore;

namespace vasilek
{
    public class AppDatabaseContext : DbContext
    {
        public AppDatabaseContext(DbContextOptions<AppDatabaseContext> options) : base(options)
        {

        }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<FollowModel> Follows { get; set; }
        public DbSet<PhotoModel> Photos { get; set; }
    }
}
