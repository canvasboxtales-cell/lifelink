from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class RegisterDonor(BaseModel):
    email: EmailStr
    password: str
    name: str
    date_of_birth: Optional[str] = None
    phone: Optional[str] = None
    national_id: Optional[str] = None
    blood_type: str
    weight_kg: Optional[float] = None
    last_donation_date: Optional[str] = None
    medical_notes: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    agreed_terms: bool
    agreed_privacy: bool


class RegisterHospital(BaseModel):
    email: EmailStr
    password: str
    hospital_name: str
    facility_type: Optional[str] = None
    license_number: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    agreed_terms: bool
    agreed_privacy: bool
