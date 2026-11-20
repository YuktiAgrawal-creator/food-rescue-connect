#!/usr/bin/env bash
# exit on error
set -o errexit

if [ -d "backend" ]; then
    echo "Entering backend directory..."
    cd backend
fi

pip install --upgrade pip
pip install -r requirements.txt
python manage.py collectstatic --no-input
