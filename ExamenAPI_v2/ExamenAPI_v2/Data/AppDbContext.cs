using ExamenAPI_v2.Models;

namespace examenAPI_v2.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext() { }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Pagos> Pagos { get; set; }
    }
}
