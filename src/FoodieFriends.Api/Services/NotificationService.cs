using FoodieFriends.Api.DTOs;
using FoodieFriends.Core.Entities;
using FoodieFriends.Core.Enums;
using FoodieFriends.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FoodieFriends.Api.Services;

public class NotificationService
{
    private readonly FoodieFriendsDbContext _context;

    public NotificationService(FoodieFriendsDbContext context)
    {
        _context = context;
    }

    public async Task CreateNotificationAsync(
        Guid recipientUserId,
        Guid actorId,
        NotificationType type,
        Guid? reviewId,
        Guid? restaurantId,
        string message)
    {
        if (recipientUserId == actorId)
        {
            return; // Don't notify oneself
        }

        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = recipientUserId,
            ActorId = actorId,
            Type = type,
            ReviewId = reviewId,
            RestaurantId = restaurantId,
            Message = message,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Notifications.AddAsync(notification);
        await _context.SaveChangesAsync();
    }

    public async Task<List<NotificationDto>> GetNotificationsAsync(Guid userId)
    {
        var items = await _context.Notifications
            .Include(n => n.Actor)
            .Include(n => n.Restaurant)
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(50)
            .ToListAsync();

        return items.Select(n => new NotificationDto(
            Id: n.Id,
            UserId: n.UserId,
            ActorId: n.ActorId,
            ActorUsername: n.Actor?.Username ?? "unknown",
            ActorDisplayName: n.Actor?.DisplayName ?? "Someone",
            ActorProfilePhotoUrl: n.Actor?.ProfilePhotoUrl,
            Type: n.Type,
            TypeName: n.Type.ToString(),
            ReviewId: n.ReviewId,
            RestaurantId: n.RestaurantId,
            RestaurantName: n.Restaurant?.Name,
            Message: n.Message,
            IsRead: n.IsRead,
            CreatedAt: n.CreatedAt
        )).ToList();
    }

    public async Task<bool> MarkAsReadAsync(Guid notificationId, Guid userId)
    {
        var item = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);

        if (item == null) return false;

        item.IsRead = true;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task MarkAllAsReadAsync(Guid userId)
    {
        var unread = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var item in unread)
        {
            item.IsRead = true;
        }

        await _context.SaveChangesAsync();
    }
}
