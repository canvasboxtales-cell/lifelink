from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import DonorProfile, AvailabilityStatus, User
from app.services.auth_service import get_current_user
from app.services.donor_service import search_donors
from app.schemas.donor import DonorUpdate

router = APIRouter()


@router.get("/search")
async def search(
    blood_type: Optional[str] = None,
    radius_km: float = Query(default=10.0),
    lat: float = Query(default=6.9271),
    lng: float = Query(default=79.8612),
    min_donations: int = Query(default=0),
    availability: Optional[str] = Query(default="available"),
    db: AsyncSession = Depends(get_db),
):
    results = await search_donors(db, blood_type, radius_km, lat, lng, min_donations, availability)

    out = []
    for r in results:
        donor = r["donor"]
        out.append({
            "id": donor.id,
            "name": donor.name,
            "blood_type": donor.blood_type,
            "location": donor.city or "Unknown",
            "distance_km": r["distance_km"],
            "match_score": r["match_score"],
            "total_donations": donor.total_donations,
            "response_rate": donor.response_rate,
            "last_donation": donor.last_donation.strftime("%b %d") if donor.last_donation else "N/A",
            "availability": donor.availability.value if donor.availability else "unavailable",
            "ai_recommendation": r["ai_recommendation"],
        })
    return out


@router.get("/{donor_id}/profile")
async def get_profile(donor_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DonorProfile).where(DonorProfile.id == donor_id))
    donor = result.scalar_one_or_none()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    return {
        "id": donor.id,
        "name": donor.name,
        "blood_type": donor.blood_type,
        "city": donor.city,
        "phone": donor.phone,
        "total_donations": donor.total_donations,
        "response_rate": donor.response_rate,
        "availability": donor.availability.value if donor.availability else "unavailable",
        "last_donation": donor.last_donation,
    }


@router.put("/{donor_id}/availability")
async def update_availability(
    donor_id: str,
    data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(DonorProfile).where(DonorProfile.id == donor_id))
    donor = result.scalar_one_or_none()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")

    if data.get("available"):
        donor.availability = AvailabilityStatus.available
    else:
        donor.availability = AvailabilityStatus.unavailable

    await db.commit()
    return {"status": "updated", "availability": donor.availability.value}
