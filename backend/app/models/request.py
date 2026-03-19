from sqlalchemy import Column, String, Boolean, Float, Integer, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base
import enum
import uuid
from datetime import datetime


class UrgencyLevel(str, enum.Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class RequestStatus(str, enum.Enum):
    active = "active"
    pending = "pending"
    completed = "completed"
    cancelled = "cancelled"


class BloodRequest(Base):
    __tablename__ = "blood_requests"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_id = Column(String, ForeignKey("hospital_profiles.id"), nullable=False)
    blood_type = Column(String, nullable=False)
    units_needed = Column(Integer, nullable=False, default=1)
    urgency = Column(Enum(UrgencyLevel), default=UrgencyLevel.MEDIUM)
    status = Column(Enum(RequestStatus), default=RequestStatus.active)
    patient_condition = Column(Text)
    doctor_name = Column(String)
    deadline = Column(DateTime)
    matches_found = Column(Integer, default=0)
    contacted = Column(Integer, default=0)
    confirmed = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)

    hospital = relationship("HospitalProfile", back_populates="blood_requests")
    donation_records = relationship("DonationRecord", back_populates="request")


class DonationRecord(Base):
    __tablename__ = "donation_records"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    donor_id = Column(String, ForeignKey("donor_profiles.id"), nullable=False)
    request_id = Column(String, ForeignKey("blood_requests.id"), nullable=True)
    hospital_name = Column(String)
    patient_type = Column(String)
    donated_at = Column(DateTime, default=datetime.utcnow)

    donor = relationship("DonorProfile", back_populates="donation_history")
    request = relationship("BloodRequest", back_populates="donation_records")
