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

    print("Running database migrations...", flush=True)
    try:
        proc = subprocess.run([sys.executable, "manage.py", "migrate", "--no-input"], capture_output=True, text=True)
        if proc.stdout:
            print(proc.stdout, flush=True)
        if proc.stderr:
            print(proc.stderr, flush=True)
    except Exception as e:
        print(f"Notice: Migration execution: {e}", flush=True)

    print("Synchronizing PostgreSQL sequences...", flush=True)
    try:
        proc = subprocess.run([sys.executable, "sync_sequences.py"], capture_output=True, text=True)
        if proc.stdout:
            print(proc.stdout, flush=True)
        if proc.stderr:
            print(proc.stderr, flush=True)
    except Exception as e:
        print(f"Notice: Sequence sync execution: {e}", flush=True)
