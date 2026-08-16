import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from donations.models import Donation
from pickups.models import PickupRequest
from django.contrib.auth import get_user_model

User = get_user_model()

print("--- DONATIONS ---")
for d in Donation.objects.all():
    print(f"ID: {d.id}, Qty: {d.quantity}, Unit: {d.unit}, Status: {d.status}, Pickups: {[p.status for p in d.pickup_requests.all()]}")

print("\n--- PICKUPS ---")
for p in PickupRequest.objects.all():
    print(f"ID: {p.id}, Donation ID: {p.donation.id}, Status: {p.status}")

print("\n--- USERS ---")
for u in User.objects.all():
    print(f"Username: {u.username}, Role: {u.role}")

print("\n--- AGGREGATIONS ---")
completed_donations = Donation.objects.filter(pickup_requests__status='COMPLETED').distinct()
print(f"Donations with completed pickups: {completed_donations.count()}")

active_donors = User.objects.filter(role='DONOR', donations_made__isnull=False).distinct().count()
active_orgs = User.objects.filter(role='ORGANIZATION', pickup_requests_made__isnull=False).distinct().count()

print(f"Active Donors: {active_donors}")
print(f"Active Orgs: {active_orgs}")
