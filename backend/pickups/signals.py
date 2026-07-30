from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import PickupRequest
from notifications.models import Notification

@receiver(post_save, sender=PickupRequest)
def create_pickup_notification(sender, instance, created, **kwargs):
    if created:
        # Notify donor that a new pickup request has been made
        Notification.objects.create(
            user=instance.donation.donor,
            notification_type='INFO',
            message=f"New pickup request from {instance.requester.username} for '{instance.donation.title}'."
        )
    else:
        # Check status changes
        if instance.status == 'ACCEPTED':
            Notification.objects.create(
                user=instance.requester,
                notification_type='SUCCESS',
                message=f"Your pickup request for '{instance.donation.title}' has been accepted!"
            )
        elif instance.status == 'REJECTED':
            Notification.objects.create(
                user=instance.requester,
                notification_type='WARNING',
                message=f"Your pickup request for '{instance.donation.title}' has been rejected."
            )
        elif instance.status == 'COMPLETED':
            # Notify both
            Notification.objects.create(
                user=instance.requester,
                notification_type='SUCCESS',
                message=f"Pickup for '{instance.donation.title}' completed successfully."
            )
            Notification.objects.create(
                user=instance.donation.donor,
                notification_type='SUCCESS',
                message=f"Pickup for '{instance.donation.title}' completed successfully."
            )
