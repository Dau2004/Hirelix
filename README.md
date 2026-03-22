# Hirelix — AI-Powered Recruitment Platform

Hirelix is a full-stack recruitment management system built for HR teams and job applicants. It automates applicant screening and ranking using NLP-based scoring, giving HR professionals objective, ranked candidate lists instantly.

---
VkXoKCX8D20pFoZY
## Features

### HR Side
- Post and manage job vacancies
- Auto-ranking of applicants by AI scoring (qualifications, experience, skills, cover letter, overall)
- View applicant resume and cover letter directly in the portal
- Change application status: Graded → Under Review → Shortlisted / Rejected
- Download individual applicant assessment reports (PDF-ready)
- Export full rankings as CSV
- Delete job postings

### Applicant Side
- Register and submit applications (resume + cover letter)
- Track application status in real time with notifications in the portal
- Candidate anonymity — identified only by unique code (e.g. `HLX-A3F9C2`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 5 + Django REST Framework |
| Authentication | JWT via `djangorestframework-simplejwt` |
| NLP / Scoring | spaCy (`en_core_web_md`) + scikit-learn |
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Database | PostgreSQL (production) / SQLite (development) |
| Media Storage | Cloudinary |
| Static Files | WhiteNoise |

---

## Project Structure

```
hirelix/
├── backend/
│   ├── apps/
│   │   ├── users/          # Custom user model (applicant | hr roles)
│   │   ├── jobs/           # Job postings, permissions
│   │   ├── applications/   # Applications, scoring models
│   │   └── grading/        # NLP scoring engine
│   ├── hirelix_project/    # Django settings, URLs
│   ├── build.sh            # Render build script
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/            # Axios client, jobs, applications, auth
    │   ├── context/        # AuthContext (JWT decode, role-based access)
    │   ├── layouts/        # HRLayout (sidebar), MainLayout (navbar)
    │   ├── pages/
    │   │   ├── hr/         # Dashboard, PostJob, Rankings
    │   │   └── applicant/  # Apply, MyApplications
    │   └── App.jsx
    ├── index.html
    └── vite.config.js
```

---

## Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_md
cp .env.example .env   # fill in values
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
# create .env.local with:
# VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

---

## Environment Variables

### Backend (`.env`)

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=                      # PostgreSQL URL (leave empty for SQLite)
CORS_ALLOWED_ORIGINS=http://localhost:5173
CLOUDINARY_CLOUD_NAME=             # leave empty to use local media
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (`.env.local`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## Deployment

| Service | Platform |
|---|---|
| Backend | [Render](https://render.com) |
| Frontend | [Vercel](https://vercel.com) |
| Database | [Supabase](https://supabase.com) |
| Media | [Cloudinary](https://cloudinary.com) |

**Render settings:**
- Root directory: `backend`
- Build command: `./build.sh`
- Start command: `gunicorn hirelix_project.wsgi:application`

**Vercel settings:**
- Root directory: `frontend`
- Framework preset: Vite

---

## Scoring Model

Each application is scored across 5 dimensions using spaCy NLP:

| Dimension | Weight |
|---|---|
| Qualifications match | 25% |
| Experience match | 25% |
| Skills match | 25% |
| Cover letter quality | 15% |
| Overall impression | 10% |

Candidates are ranked from highest to lowest score. HR sees only candidate codes — no names — until they decide to shortlist.

---

## License

MIT
