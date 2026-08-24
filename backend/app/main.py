from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.resume import router as resume_router
from app.api.routes.jobs import router as jobs_router
from app.api.routes.screening import router as screening_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.search import router as search_router


app = FastAPI(
    title="Smart Resume Screener API",
    description="AI-powered resume screening and job matching system",
    version="1.0.0",
)


# --------------------------------
# CORS
# --------------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000",
    ],

    allow_origin_regex=r"https://.*\.vercel\.app",

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------
# Routers
# --------------------------------

app.include_router(resume_router)
app.include_router(jobs_router)
app.include_router(screening_router)
app.include_router(dashboard_router)
app.include_router(search_router)


# --------------------------------
# Root
# --------------------------------

@app.get("/")
def root():
    return {
        "message": "Smart Resume Screener API is running"
    }


# --------------------------------
# Health
# --------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }