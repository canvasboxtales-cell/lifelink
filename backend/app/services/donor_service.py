from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from geopy.distance import geodesic

from app.models.user import DonorProfile, AvailabilityStatus
from app.services.ml_service import predict_donation_probability, compute_match_score, generate_ai_recommendation

COMPATIBLE_DONORS = {
    "A+":  ["A+", "A-", "O+", "O-"],
    "A-":  ["A-", "O-"],
    "B+":  ["B+", "B-", "O+", "O-"],
    "B-":  ["B-", "O-"],
    "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    "AB-": ["A-", "B-", "AB-", "O-"],
    "O+":  ["O+", "O-"],
    "O-":  ["O-"],
}


async def search_donors(
    db: AsyncSession,
    blood_type: Optional[str],
    radius_km: float,
    lat: float,
    lng: float,
    min_donations: int,
    availability: Optional[str],
) -> List[dict]:
    query = select(DonorProfile)

    if availability and availability != "all":
        try:
            avail_status = AvailabilityStatus(availability)
            query = query.where(DonorProfile.availability == avail_status)
        except ValueError:
            pass

    if min_donations > 0:
        query = query.where(DonorProfile.total_donations >= min_donations)

    result = await db.execute(query)
    all_donors = result.scalars().all()

    matched = []
    compatible_types = COMPATIBLE_DONORS.get(blood_type, [blood_type]) if blood_type else None

    for donor in all_donors:
        # Filter by blood type compatibility
        if compatible_types and donor.blood_type not in compatible_types:
            continue

        # Calculate distance
        if donor.latitude and donor.longitude:
            donor_coords = (donor.latitude, donor.longitude)
            request_coords = (lat, lng)
            distance_km = geodesic(donor_coords, request_coords).km
        else:
            distance_km = 5.0  # Default distance

        if distance_km > radius_km:
            continue

        # Compute match score using ML
        months_since_donation = 3
        if donor.last_donation:
            from datetime import datetime
            diff = datetime.utcnow() - donor.last_donation
            months_since_donation = max(1, diff.days // 30)

        monetary = donor.total_donations * 450  # ~450cc per donation
        time_months = max(1, donor.total_donations * 3)

        prob = predict_donation_probability(
            recency=months_since_donation,
            frequency=donor.total_donations,
            monetary=monetary,
            time_months=time_months,
        )

        blood_compat = 1.0 if (not blood_type or donor.blood_type == blood_type) else 0.8
        match_score = compute_match_score(prob, distance_km, donor.response_rate, blood_compat)
        ai_rec = generate_ai_recommendation(donor.response_rate, distance_km, match_score)

        matched.append({
            "donor": donor,
            "distance_km": round(distance_km, 1),
            "match_score": match_score,
            "ai_recommendation": ai_rec,
        })

    # Sort by match score descending
    matched.sort(key=lambda x: x["match_score"], reverse=True)
    return matched[:20]
