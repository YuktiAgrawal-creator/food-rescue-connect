import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client

client = Client()
response = client.get('/api/analytics/')
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")
