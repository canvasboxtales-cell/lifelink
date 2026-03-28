from fastapi import FastAPI, Depends  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession  # type: ignore

from app.routers import auth, donors, requests, admin, ml  # type: ignore
from app.ml.model_loader import get_model  # type: ignore
from app.database import create_tables, get_db  # type: ignore

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


@app.get("/api/public/stats")
async def get_public_stats(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select, func  # type: ignore
    from app.models.user import DonorProfile  # type: ignore
    from app.models.request import BloodRequest, RequestStatus, DonationRecord  # type: ignore
    
    donor_count = await db.scalar(select(func.count(DonorProfile.id))) or 0
    active_req_count = await db.scalar(
        select(func.count(BloodRequest.id)).where(BloodRequest.status == "active")
    ) or 0
    total_req = await db.scalar(select(func.count(BloodRequest.id))) or 1
    completed_req = await db.scalar(
        select(func.count(BloodRequest.id)).where(BloodRequest.status == "completed")
    ) or 0
    
    lives_saved = await db.scalar(select(func.count(DonationRecord.id))) or 0
    
    # 1 donation = up to 3 lives saved
    calculated_lives = (lives_saved + completed_req) * 3
    success_rate = (completed_req / total_req) * 100 if total_req > 0 else 0.0

    urgent_result = await db.execute(
        select(BloodRequest)
        .where(BloodRequest.status == "active")
        .where(BloodRequest.urgency == "HIGH")
        .limit(5)
    )
    urgent_requests = urgent_result.scalars().all()
    urgent_blood_types = list(set([r.blood_type for r in urgent_requests])) if urgent_requests else []
    
    return {
        "active_donors": donor_count,
        "lives_saved": calculated_lives,
        "success_rate": round(float(success_rate), 1),  # type: ignore
        "active_requests": active_req_count,
        "urgent_count": len(urgent_requests),
        "urgent_blood_types": urgent_blood_types
    }
