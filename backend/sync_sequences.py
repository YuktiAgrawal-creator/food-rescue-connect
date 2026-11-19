import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.management.color import no_style
from django.db import connection
from django.apps import apps

def sync_sequences():
    apps_to_sync = ['users', 'donations', 'pickups', 'notifications']
    for app_name in apps_to_sync:
        try:
            app_config = apps.get_app_config(app_name)
            models = list(app_config.get_models())
            if models:
                statements = connection.ops.sequence_reset_sql(no_style(), models)
                with connection.cursor() as cursor:
                    for sql in statements:
                        cursor.execute(sql)
                print(f"Synchronized sequences for {app_name}")
        except Exception as e:
            print(f"Notice: sequence sync for {app_name}: {e}")

if __name__ == '__main__':
    sync_sequences()
    print("PostgreSQL sequence synchronization complete.")
