from django.db import models
from django.conf import settings

class Donation(models.Model):
    STATUS_CHOICES = (
        ('AVAILABLE', 'Available'),
        ('PENDING', 'Pending Pickup'),
        ('ACCEPTED', 'Pickup Accepted'),
        ('PICKED_UP', 'Picked Up'),
        ('COMPLETED', 'Completed'),
        ('EXPIRED', 'Expired'),
        ('CANCELLED', 'Cancelled'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50) # e.g., kg, lbs, items, meals
    food_category = models.CharField(max_length=100)
    
    expires_at = models.DateTimeField()
    pickup_ready_by = models.DateTimeField()
    
    donor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='donations_made')
    organization_assigned = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations_received')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    image = models.ImageField(upload_to='donations/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.status}"
