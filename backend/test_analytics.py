import requests
import json
import time

time.sleep(2)

url = "http://localhost:8000/api/analytics/"
r = requests.get(url)
print("Status Code:", r.status_code)
try:
    print(json.dumps(r.json(), indent=2))
except Exception as e:
    print("Failed to decode JSON:", e)
    print(r.text)
