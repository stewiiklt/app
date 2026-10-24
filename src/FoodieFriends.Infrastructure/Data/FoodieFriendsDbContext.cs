using FoodieFriends.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodieFriends.Infrastructure.Data;

public class FoodieFriendsDbContext : DbContext
{
    public FoodieFriendsDbContext(DbContextOptions<FoodieFriendsDbContext> options)
        : base(options)
    {
    }

    public DbSet<Country> Countries => Set<Country>();
    public DbSet<Municipality> Municipalities => Set<Municipality>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Restaurant> Restaurants => Set<Restaurant>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ReviewPhoto> ReviewPhotos => Set<ReviewPhoto>();
    public DbSet<Follow> Follows => Set<Follow>();
    public DbSet<WantToTry> WantToTryEntries => Set<WantToTry>();
    public DbSet<ReviewLike> ReviewLikes => Set<ReviewLike>();
    public DbSet<ReviewComment> ReviewComments => Set<ReviewComment>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<TrendingRestaurant> TrendingRestaurants => Set<TrendingRestaurant>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Country
        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(c => c.Code);
            entity.Property(c => c.Code).HasMaxLength(2);
            entity.Property(c => c.Name).HasMaxLength(100).IsRequired();
            entity.Property(c => c.FlagEmoji).HasMaxLength(10);
        });

        // Municipality
        modelBuilder.Entity<Municipality>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.Property(m => m.Name).HasMaxLength(100).IsRequired();
            entity.HasOne(m => m.Country)
                .WithMany(c => c.Municipalities)
                .HasForeignKey(m => m.CountryCode)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Username).HasMaxLength(30).IsRequired();
            entity.HasIndex(u => u.Username).IsUnique();
            entity.Property(u => u.DisplayName).HasMaxLength(100).IsRequired();
            entity.Property(u => u.Email).HasMaxLength(200);
            entity.Property(u => u.Bio).HasMaxLength(500);

            entity.HasOne(u => u.City)
                .WithMany(m => m.Users)
                .HasForeignKey(u => u.CityId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Restaurant
        modelBuilder.Entity<Restaurant>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Name).HasMaxLength(200).IsRequired();
            entity.Property(r => r.Address).HasMaxLength(300).IsRequired();
            entity.Property(r => r.CuisineType).HasMaxLength(100).IsRequired();
            entity.Property(r => r.AverageRating).HasPrecision(4, 2);
            entity.Property(r => r.Latitude).HasPrecision(10, 7);
            entity.Property(r => r.Longitude).HasPrecision(10, 7);

            entity.HasOne(r => r.Municipality)
                .WithMany(m => m.Restaurants)
                .HasForeignKey(r => r.MunicipalityId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(r => new { r.MunicipalityId, r.CuisineType });
        });

        // Review
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Title).HasMaxLength(200).IsRequired();
            entity.Property(r => r.Body).IsRequired();

            entity.HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(r => r.Restaurant)
                .WithMany(rest => rest.Reviews)
                .HasForeignKey(r => r.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(r => r.Tags)
                .WithMany(t => t.Reviews);

            entity.HasIndex(r => new { r.RestaurantId, r.CreatedAt });
            entity.HasIndex(r => new { r.UserId, r.CreatedAt });
        });

        // ReviewPhoto
        modelBuilder.Entity<ReviewPhoto>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Url).IsRequired();
            entity.Property(p => p.Caption).HasMaxLength(300);

            entity.HasOne(p => p.Review)
                .WithMany(r => r.Photos)
                .HasForeignKey(p => p.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Follow - Composite Key
        modelBuilder.Entity<Follow>(entity =>
        {
            entity.HasKey(f => new { f.FollowerId, f.FolloweeId });

            entity.HasOne(f => f.Follower)
                .WithMany(u => u.Following)
                .HasForeignKey(f => f.FollowerId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(f => f.Followee)
                .WithMany(u => u.Followers)
                .HasForeignKey(f => f.FolloweeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // WantToTry
        modelBuilder.Entity<WantToTry>(entity =>
        {
            entity.HasKey(w => w.Id);
            entity.HasIndex(w => new { w.UserId, w.RestaurantId }).IsUnique();

            entity.HasOne(w => w.User)
                .WithMany(u => u.WantToTryList)
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(w => w.Restaurant)
                .WithMany(r => r.WantToTryEntries)
                .HasForeignKey(w => w.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ReviewLike - Composite Key
        modelBuilder.Entity<ReviewLike>(entity =>
        {
            entity.HasKey(l => new { l.UserId, l.ReviewId });

            entity.HasOne(l => l.User)
                .WithMany(u => u.Likes)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(l => l.Review)
                .WithMany(r => r.Likes)
                .HasForeignKey(l => l.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ReviewComment
        modelBuilder.Entity<ReviewComment>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Content).HasMaxLength(1000).IsRequired();

            entity.HasOne(c => c.Review)
                .WithMany(r => r.Comments)
                .HasForeignKey(c => c.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Tag
        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Name).HasMaxLength(50).IsRequired();
            entity.Property(t => t.Slug).HasMaxLength(50).IsRequired();
            entity.HasIndex(t => t.Slug).IsUnique();
        });

        // Notification
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(n => n.Id);
            entity.Property(n => n.Message).HasMaxLength(500).IsRequired();

            entity.HasOne(n => n.User)
                .WithMany(u => u.ReceivedNotifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(n => n.Actor)
                .WithMany(u => u.TriggeredNotifications)
                .HasForeignKey(n => n.ActorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(n => n.Review)
                .WithMany()
                .HasForeignKey(n => n.ReviewId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(n => n.Restaurant)
                .WithMany()
                .HasForeignKey(n => n.RestaurantId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // TrendingRestaurant
        modelBuilder.Entity<TrendingRestaurant>(entity =>
        {
            entity.HasKey(tr => tr.Id);

            entity.HasOne(tr => tr.Restaurant)
                .WithMany(r => r.TrendingRecords)
                .HasForeignKey(tr => tr.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(tr => tr.Municipality)
                .WithMany()
                .HasForeignKey(tr => tr.MunicipalityId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
