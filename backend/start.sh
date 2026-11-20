#!/usr/bin/env bash
set -o errexit

python manage.py migrate --no-input
python sync_sequences.py
exec gunicorn config.wsgi:application --bind 0.0.0.0:
