from sqlalchemy import Column, String, Boolean, Float, Integer, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base
import enum
import uuid
from datetime import datetime


class UserRole(str, enum.Enum):
    donor = "donor"
    hospital = "hospital"
    admin = "admin"


class AvailabilityStatus(str, enum.Enum):
    available = "available"
    pending = "pending"
    unavailable = "unavailable"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    donor_profile = relationship("DonorProfile", back_populates="user", uselist=False)
    hospital_profile = relationship("HospitalProfile", back_populates="user", uselist=False)


class DonorProfile(Base):
    __tablename__ = "donor_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    blood_type = Column(String, nullable=False)
    phone = Column(String)
    national_id = Column(String)
    date_of_birth = Column(DateTime)
    weight_kg = Column(Float)
    city = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    availability = Column(Enum(AvailabilityStatus), default=AvailabilityStatus.available)
    last_donation = Column(DateTime)
    total_donations = Column(Integer, default=0)
    response_rate = Column(Float, default=100.0)
    medical_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="donor_profile")
    donation_history = relationship("DonationRecord", back_populates="donor")


class HospitalProfile(Base):
    __tablename__ = "hospital_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    hospital_name = Column(String, nullable=False)
    facility_type = Column(String)
    license_number = Column(String)
    contact_phone = Column(String)
    address = Column(Text)
    city = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="hospital_profile")
    blood_requests = relationship("BloodRequest", back_populates="hospital")
