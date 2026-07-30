from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('DONOR', 'Donor'),
        ('ORGANIZATION', 'Organization'),
        ('ADMIN', 'Admin'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='DONOR')
    phone = models.CharField(max_length=20, blank=True, null=True)
    organization_name = models.CharField(max_length=255, blank=True, null=True, help_text="Business or NGO name")
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.username} - {self.role}"
