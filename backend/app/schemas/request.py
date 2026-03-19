from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RequestCreate(BaseModel):
    blood_type: str
    units_needed: int = 1
    urgency: str = "MEDIUM"
    patient_condition: Optional[str] = None
    doctor_name: Optional[str] = None
    deadline: Optional[datetime] = None


class RequestOut(BaseModel):
    id: str
    blood_type: str
    units_needed: int
    urgency: str
    status: str
    patient_condition: Optional[str]
    doctor_name: Optional[str]
    deadline: Optional[datetime]
    matches_found: int
    contacted: int
    confirmed: int
    created_at: datetime
    completed_at: Optional[datetime]
    hospital_name: Optional[str] = None
    hospital_location: Optional[str] = None

    class Config:
        from_attributes = True


class RequestStatusUpdate(BaseModel):
    status: str
