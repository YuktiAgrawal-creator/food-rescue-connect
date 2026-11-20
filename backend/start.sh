#!/usr/bin/env bash
echo "=== Starting Food Rescue Connect Web Service ==="

if [ -d "backend" ]; then
    echo "Entering backend directory..."
    cd backend
fi

if [ -z "$DATABASE_URL" ]; then
    echo "WARNING: DATABASE_URL is not set in environment variables!"
fi

echo "Applying database migrations..."
python manage.py migrate --no-input || {
    echo "ERROR: Database migration failed. Please check DATABASE_URL in Render Environment settings."
    exit 1
}

echo "Synchronizing PostgreSQL sequences..."
python sync_sequences.py || {
    echo "WARNING: Sequence sync had a notice, proceeding..."
}

echo "Starting Gunicorn on port ${PORT:-10000}..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-10000}
