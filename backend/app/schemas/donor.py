from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DonationRecordOut(BaseModel):
    id: str
    hospital_name: Optional[str]
    patient_type: Optional[str]
    donated_at: datetime

    class Config:
        from_attributes = True


class DonorOut(BaseModel):
    id: str
    name: str
    blood_type: str
    city: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    availability: str
    total_donations: int
    response_rate: float
    last_donation: Optional[datetime]
    distance_km: Optional[float] = None
    match_score: Optional[float] = None
    ai_recommendation: Optional[str] = None
    donation_history: List[DonationRecordOut] = []

    class Config:
        from_attributes = True


class DonorUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    availability: Optional[str] = None
    medical_notes: Optional[str] = None


class DonorSearch(BaseModel):
    blood_type: Optional[str] = None
    radius_km: float = 10.0
    lat: float = 6.9271
    lng: float = 79.8612
    min_donations: int = 0
    availability: Optional[str] = "available"
