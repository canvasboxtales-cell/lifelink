from pydantic import BaseModel
from typing import Optional


class PredictRequest(BaseModel):
    recency: int
    frequency: int
    monetary: int
    time: int


class PredictResponse(BaseModel):
    donation_probability: float
    will_donate: bool
    confidence: str


class MatchScoreRequest(BaseModel):
    donor_id: str
    request_lat: float
    request_lng: float
    required_blood_type: str


class MatchScoreResponse(BaseModel):
    match_score: float
    donation_probability: float
    distance_km: float
    ai_recommendation: str
    is_compatible: bool
