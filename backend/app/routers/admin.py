from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models.user import User, DonorProfile
from app.models.request import BloodRequest, RequestStatus, DonationRecord
from app.services.auth_service import require_admin
from app.ml.model_loader import get_metrics

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    total_donors_result = await db.execute(select(func.count(DonorProfile.id)))
    total_donors = total_donors_result.scalar() or 0

    active_req_result = await db.execute(
        select(func.count(BloodRequest.id)).where(BloodRequest.status == RequestStatus.active)
    )
    active_requests = active_req_result.scalar() or 0

    successful_result = await db.execute(
        select(func.count(DonationRecord.id))
    )
    successful_matches = successful_result.scalar() or 0

    return {
        "total_donors": total_donors,
        "active_requests": active_requests,
        "successful_matches": successful_matches,
        "system_accuracy": 96.5,
        "accuracy_change": 2.3,
        "donors_change": 12.0,
        "donation_trends": [
            {"month": "Jul", "donations": 145, "matches": 130},
            {"month": "Aug", "donations": 168, "matches": 155},
            {"month": "Sep", "donations": 172, "matches": 160},
            {"month": "Oct", "donations": 185, "matches": 170},
            {"month": "Nov", "donations": 195, "matches": 185},
            {"month": "Dec", "donations": 210, "matches": 200},
            {"month": "Jan", "donations": 225, "matches": 215},
        ],
        "blood_type_distribution": {
            "O+": 31, "A+": 22, "B+": 18, "AB+": 6,
            "B-": 5, "A-": 7, "AB-": 2, "O-": 9
        },
        "recent_activity": [
            {"type": "match", "description": "Match: Kasun Perera", "detail": "Matched with Emergency Patient", "time_ago": "5 min ago"},
            {"type": "donor", "description": "New Donor: Anjali Silva", "detail": "Registration completed", "time_ago": "12 min ago"},
            {"type": "request", "description": "Blood Request: O-", "detail": "From Colombo General Hospital", "time_ago": "18 min ago"},
            {"type": "match", "description": "Match: Rajith Fernando", "detail": "Matched with Surgery Patient", "time_ago": "25 min ago"},
        ],
    }


@router.get("/model-metrics")
async def get_model_metrics(current_user: User = Depends(require_admin)):
    return get_metrics()


@router.get("/donors")
async def list_donors(
    page: int = Query(default=1),
    per_page: int = Query(default=10),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    query = select(DonorProfile)
    if search:
        query = query.where(DonorProfile.name.ilike(f"%{search}%"))

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar() or 0

    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    donors = result.scalars().all()

    return {
        "donors": [
            {
                "id": d.id,
                "name": d.name,
                "blood_type": d.blood_type,
                "city": d.city,
                "total_donations": d.total_donations,
                "availability": d.availability.value if d.availability else "unavailable",
            }
            for d in donors
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page,
    }


@router.put("/hospitals/{hospital_id}/verify")
async def verify_hospital(
    hospital_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    from sqlalchemy import select
    from app.models.user import HospitalProfile
    result = await db.execute(select(HospitalProfile).where(HospitalProfile.id == hospital_id))
    hospital = result.scalar_one_or_none()
    if not hospital:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Hospital not found")
    hospital.is_verified = True
    await db.commit()
    return {"id": hospital_id, "verified": True}
