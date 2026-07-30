# Food Rescue Connect

Rescue Food. Reduce Waste. Feed Communities.

Food Rescue Connect is a full-stack platform that connects surplus-food donors (restaurants, supermarkets) with receiving organizations (NGOs, food banks).

## Tech Stack
- **Frontend:** React, Vite, React Router, Leaflet, Axios
- **Backend:** Django, Django REST Framework, SimpleJWT
- **Database:** PostgreSQL

## Local Development (Without Docker)

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 15+ running locally

### Backend Setup
1. `cd backend`
2. `python -m venv venv`
3. Activate venv: `source venv/bin/activate` (Mac/Linux) or `venv\Scripts\activate` (Windows)
4. `pip install -r requirements.txt`
5. Create `.env` file with your PostgreSQL credentials (see `.env.example` if available, or just set `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`).
6. `python manage.py migrate`
7. `python manage.py runserver`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

The frontend will run on `http://localhost:5173` and communicate with the backend on `http://localhost:8000`.

## Deployment

This project is configured for deployment on Vercel (Frontend) and Render (Backend).

### Vercel (Frontend)
1. Import the project into Vercel.
2. Set the Root Directory to `frontend`.
3. Set Environment Variable: `VITE_API_URL` = `https://<your-render-app>.onrender.com/api`
4. Deploy. The `vercel.json` ensures React Router SPA fallback works.

### Render (Backend)
1. Create a PostgreSQL database on Render.
2. Create a Blueprint Instance on Render and point it to this repository. The `render.yaml` configuration will automatically provision the backend web service and connect it to the database.
3. Make sure to set `CORS_ALLOWED_ORIGINS` to your Vercel frontend URL in Render's environment variables.
