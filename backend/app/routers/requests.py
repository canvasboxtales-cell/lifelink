from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.database import get_db
from app.models.request import BloodRequest, RequestStatus, UrgencyLevel
from app.models.user import User, HospitalProfile
from app.services.auth_service import get_current_user
from app.schemas.request import RequestCreate, RequestOut, RequestStatusUpdate

router = APIRouter()


@router.get("/")
async def list_requests(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role.value == "admin":
        result = await db.execute(select(BloodRequest))
    elif current_user.role.value == "hospital":
        hosp_result = await db.execute(
            select(HospitalProfile).where(HospitalProfile.user_id == current_user.id)
        )
        hospital = hosp_result.scalar_one_or_none()
        if not hospital:
            return []
        result = await db.execute(
            select(BloodRequest).where(BloodRequest.hospital_id == hospital.id)
        )
    else:
        result = await db.execute(
            select(BloodRequest).where(BloodRequest.status == RequestStatus.active)
        )

    requests = result.scalars().all()
    out = []
    for req in requests:
        out.append({
            "id": req.id,
            "blood_type": req.blood_type,
            "units_needed": req.units_needed,
            "urgency": req.urgency.value if req.urgency else "MEDIUM",
            "status": req.status.value if req.status else "active",
            "patient_condition": req.patient_condition,
            "doctor_name": req.doctor_name,
            "deadline": req.deadline,
            "matches_found": req.matches_found,
            "contacted": req.contacted,
            "confirmed": req.confirmed,
            "created_at": req.created_at,
            "completed_at": req.completed_at,
            "hospital_name": req.hospital.hospital_name if req.hospital else None,
            "hospital_location": req.hospital.city if req.hospital else None,
        })
    return out


@router.post("/", status_code=201)
async def create_request(
    data: RequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hosp_result = await db.execute(
        select(HospitalProfile).where(HospitalProfile.user_id == current_user.id)
    )
    hospital = hosp_result.scalar_one_or_none()
    if not hospital:
        raise HTTPException(status_code=403, detail="No hospital profile found")

    req = BloodRequest(
        hospital_id=hospital.id,
        blood_type=data.blood_type,
        units_needed=data.units_needed,
        urgency=UrgencyLevel(data.urgency),
        patient_condition=data.patient_condition,
        doctor_name=data.doctor_name,
        deadline=data.deadline,
    )
    db.add(req)
    await db.commit()
    await db.refresh(req)
    return {"id": req.id, "status": req.status.value}


@router.put("/{request_id}/status")
async def update_status(
    request_id: str,
    data: RequestStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(BloodRequest).where(BloodRequest.id == request_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    req.status = RequestStatus(data.status)
    if data.status == "completed":
        req.completed_at = datetime.utcnow()
    await db.commit()
    return {"id": req.id, "status": req.status.value}


@router.get("/{request_id}")
async def get_request(request_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BloodRequest).where(BloodRequest.id == request_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    return {
        "id": req.id,
        "blood_type": req.blood_type,
        "units_needed": req.units_needed,
        "urgency": req.urgency.value if req.urgency else "MEDIUM",
        "status": req.status.value if req.status else "active",
        "matches_found": req.matches_found,
        "contacted": req.contacted,
        "confirmed": req.confirmed,
        "created_at": req.created_at,
    }
