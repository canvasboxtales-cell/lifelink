from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, donors, requests, admin, ml
from app.ml.model_loader import get_model
from app.database import create_tables

app = FastAPI(
    title="LifeLink API",
    description="AI-powered blood donation management system for Sri Lanka",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://lifelink.lk"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    await create_tables()
    get_model()  # Pre-load ML model into memory


app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(donors.router, prefix="/api/donors", tags=["Donors"])
app.include_router(requests.router, prefix="/api/requests", tags=["Requests"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(ml.router, prefix="/api/ml", tags=["ML"])


@app.get("/health")
async def health():
    model, _ = get_model()
    return {"status": "healthy", "model_loaded": model is not None}


@app.get("/")
async def root():
    return {"message": "LifeLink API v1.0.0", "docs": "/docs"}
