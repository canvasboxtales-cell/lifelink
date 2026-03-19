from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from geopy.distance import geodesic

from app.models.user import DonorProfile
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


async def get_match_score_for_donor(
    db: AsyncSession,
    donor_id: str,
    request_lat: float,
    request_lng: float,
    required_blood_type: str,
) -> dict:
    result = await db.execute(select(DonorProfile).where(DonorProfile.id == donor_id))
    donor = result.scalar_one_or_none()

    if not donor:
        return None

    compatible_types = COMPATIBLE_DONORS.get(required_blood_type, [required_blood_type])
    is_compatible = donor.blood_type in compatible_types

    if donor.latitude and donor.longitude:
        distance_km = geodesic((donor.latitude, donor.longitude), (request_lat, request_lng)).km
    else:
        distance_km = 5.0

    from datetime import datetime
    months_since = 3
    if donor.last_donation:
        diff = datetime.utcnow() - donor.last_donation
        months_since = max(1, diff.days // 30)

    prob = predict_donation_probability(
        recency=months_since,
        frequency=donor.total_donations,
        monetary=donor.total_donations * 450,
        time_months=max(1, donor.total_donations * 3),
    )

    blood_compat = 1.0 if donor.blood_type == required_blood_type else (0.8 if is_compatible else 0.0)
    match_score = compute_match_score(prob, distance_km, donor.response_rate, blood_compat)
    ai_rec = generate_ai_recommendation(donor.response_rate, distance_km, match_score)

    return {
        "match_score": match_score,
        "donation_probability": prob,
        "distance_km": round(distance_km, 1),
        "ai_recommendation": ai_rec,
        "is_compatible": is_compatible,
    }
