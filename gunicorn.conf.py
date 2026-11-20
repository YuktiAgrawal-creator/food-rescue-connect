import os
import sys
import subprocess

# Safely extract PORT, defaulting to 10000 if unset, empty, or non-numeric
raw_port = os.environ.get("PORT", "").strip()
if raw_port and raw_port.isdigit():
    port = raw_port
else:
    port = "10000"

bind = f"0.0.0.0:{port}"
workers = 2
threads = 4
timeout = 120

def on_starting(server):
    """Run migrations and sequence sync before workers start serving traffic."""
    print(f"=== Gunicorn on_starting: Binding to {bind} ===", flush=True)
    if not os.path.exists("manage.py") and os.path.exists("backend/manage.py"):
        os.chdir("backend")
    
    # Ensure current dir is in sys.path
    cwd = os.getcwd()
    if cwd not in sys.path:
        sys.path.insert(0, cwd)

    print("Running database migrations...", flush=True)
    try:
        import django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
        django.setup()
        from django.core.management import call_command
        call_command('migrate', interactive=False)
        print("Django migrations executed successfully.", flush=True)
    except Exception as e:
        print(f"Notice: Django migrate via call_command: {e}", flush=True)
        try:
            proc = subprocess.run([sys.executable, "manage.py", "migrate", "--no-input"], capture_output=True, text=True)
            if proc.stdout:
                print(proc.stdout, flush=True)
            if proc.stderr:
                print(proc.stderr, flush=True)
        except Exception as sub_e:
            print(f"Notice: Subprocess migrate: {sub_e}", flush=True)

    print("Synchronizing PostgreSQL sequences...", flush=True)
    try:
        from sync_sequences import sync_sequences
        sync_sequences()
        print("PostgreSQL sequences synchronized successfully.", flush=True)
    except Exception as e:
        print(f"Notice: sync_sequences call: {e}", flush=True)
        try:
            proc = subprocess.run([sys.executable, "sync_sequences.py"], capture_output=True, text=True)
            if proc.stdout:
                print(proc.stdout, flush=True)
            if proc.stderr:
                print(proc.stderr, flush=True)
        except Exception as sub_e:
            print(f"Notice: Subprocess sequence sync: {sub_e}", flush=True)
