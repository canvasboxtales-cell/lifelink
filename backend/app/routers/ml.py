from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.ml import PredictRequest, PredictResponse, MatchScoreRequest, MatchScoreResponse
from app.services.ml_service import predict_donation_probability, get_prediction_threshold
from app.services.matching_service import get_match_score_for_donor

router = APIRouter()


@router.post("/predict", response_model=PredictResponse)
async def predict(data: PredictRequest):
    prob = predict_donation_probability(data.recency, data.frequency, data.monetary, data.time)
    thr = get_prediction_threshold()
    will_donate = prob >= thr
    confidence = "high" if prob >= 0.70 else "medium" if prob >= 0.45 else "low"
    return PredictResponse(
        donation_probability=prob,
        will_donate=will_donate,
        confidence=confidence,
    )


@router.post("/match-score", response_model=MatchScoreResponse)
async def match_score(data: MatchScoreRequest, db: AsyncSession = Depends(get_db)):
    result = await get_match_score_for_donor(
        db, data.donor_id, data.request_lat, data.request_lng, data.required_blood_type
    )
    if not result:
        raise HTTPException(status_code=404, detail="Donor not found")
    return MatchScoreResponse(**result)
