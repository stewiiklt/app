using FoodieFriends.Api.DTOs;
using FoodieFriends.Api.Middleware;
using FoodieFriends.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FoodieFriends.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly NotificationService _notificationService;

    public NotificationsController(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    /// <summary>
    /// GET /api/notifications - List current user's social notifications.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<NotificationDto>>> GetNotifications()
    {
        var currentUserId = HttpContext.GetCurrentUserId();
        var result = await _notificationService.GetNotificationsAsync(currentUserId);
        return Ok(result);
    }

    /// <summary>
    /// PUT /api/notifications/{id}/read - Mark a specific notification as read.
    /// </summary>
    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var currentUserId = HttpContext.GetCurrentUserId();
        var success = await _notificationService.MarkAsReadAsync(id, currentUserId);
        if (!success)
        {
            return NotFound("Notification not found.");
        }
        return Ok(new { success = true });
    }

    /// <summary>
    /// PUT /api/notifications/read-all - Mark all user notifications as read.
    /// </summary>
    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var currentUserId = HttpContext.GetCurrentUserId();
        await _notificationService.MarkAllAsReadAsync(currentUserId);
        return Ok(new { success = true });
    }
}
