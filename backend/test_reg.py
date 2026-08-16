import requests
import json
import time

# wait for server
time.sleep(2)

base_url = "http://localhost:8000/api/auth/register/"

# 1. Test Donor
donor_data = {
    "role": "DONOR",
    "first_name": "John",
    "last_name": "Doe",
    "organization_name": "Doe Foods",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "Password123!"
}

r = requests.post(base_url, json=donor_data)
print("Donor Registration:", r.status_code, r.text)

# 2. Test Organization
org_data = {
    "role": "ORGANIZATION",
    "organization_name": "Save Food Org",
    "username": "savefood",
    "email": "savefood@example.com",
    "password": "Password123!"
}

r = requests.post(base_url, json=org_data)
print("Org Registration:", r.status_code, r.text)

# 3. Test Invalid Password
inv_pass_data = dict(donor_data)
inv_pass_data["username"] = "inv1"
inv_pass_data["email"] = "inv1@ex.com"
inv_pass_data["password"] = "weak"
r = requests.post(base_url, json=inv_pass_data)
print("Invalid Password:", r.status_code, r.text)

# 4. Test Invalid Email
inv_email = dict(donor_data)
inv_email["username"] = "inv2"
inv_email["email"] = "not-an-email"
r = requests.post(base_url, json=inv_email)
print("Invalid Email:", r.status_code, r.text)

# 5. Test Invalid Names (Numbers only)
inv_name = dict(donor_data)
inv_name["username"] = "inv3"
inv_name["email"] = "inv3@ex.com"
inv_name["first_name"] = "123"
r = requests.post(base_url, json=inv_name)
print("Invalid Name:", r.status_code, r.text)

# 6. Test Duplicate Username
r = requests.post(base_url, json=donor_data)
print("Duplicate Username:", r.status_code, r.text)
