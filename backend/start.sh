#!/usr/bin/env bash
echo "=== Starting Food Rescue Connect Web Service ==="

if [ -d "backend" ]; then
    echo "Entering backend directory..."
    cd backend
fi

# Fallback port if PORT is unset, empty, or non-numeric
if [ -z "$PORT" ] || ! [ "$PORT" -eq "$PORT" ] 2>/dev/null; then
    export PORT="10000"
fi

echo "Applying database migrations..."
python manage.py migrate --no-input || echo "Migration warning, continuing..."

echo "Synchronizing PostgreSQL sequences..."
python sync_sequences.py || echo "Sequence sync notice, continuing..."

echo "Starting Gunicorn on port ${PORT}..."
exec gunicorn --bind "0.0.0.0:${PORT}" config.wsgi:application
