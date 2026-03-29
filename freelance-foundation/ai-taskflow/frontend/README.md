# AI TaskFlow

A full-stack intelligent task management application built with Next.js, FastAPI, and Supabase — featuring AI-powered productivity assistance via Groq LLM.

## Live Demo
[ai-taskflow.vercel.app](https://your-vercel-link-here) · [API Docs](https://your-render-link-here/docs)

## Features
- Secure authentication with session management (Supabase Auth)
- Full task management — create, edit, delete, filter by priority and status
- Dashboard with live task statistics
- AI Smart Suggest — analyze any task to get priority recommendations, rewritten descriptions, or actionable subtasks
- Per-user data isolation enforced at the database level (Row Level Security)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | FastAPI (Python), Pydantic |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| AI | Groq API — llama-3.3-70b-versatile |
| Deployment | Vercel (frontend), Render (backend) |

## Architecture
```
Next.js (Vercel) → FastAPI (Render) → Supabase (PostgreSQL)
                                  ↘ Groq API (AI)
```

## Related Repositories
- Frontend: [github.com/you/ai-taskflow-frontend](https://github.com)
- Backend: [github.com/you/ai-taskflow-backend](https://github.com)

## Local Development

**Backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

**Backend `.env`**
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
```

**Frontend `.env.local`**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=
```
```

---

# Deployment Order (Follow Exactly)
```
1. Push both repos to GitHub
2. Deploy backend on Render → get Render URL
3. Update NEXT_PUBLIC_API_URL in Vercel with Render URL
4. Deploy frontend on Vercel → get Vercel URL
5. Update CORS in main.py with Vercel URL → push → Render redeploys
6. Update Supabase redirect URLs with Vercel URL
7. Test the live app end to end
