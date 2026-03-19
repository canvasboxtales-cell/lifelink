from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import User, UserRole, DonorProfile, HospitalProfile
from app.schemas.auth import LoginRequest, TokenResponse, RegisterDonor, RegisterHospital
from app.services.auth_service import verify_password, get_password_hash, create_access_token

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    name = user.email.split("@")[0]
    if user.donor_profile:
        name = user.donor_profile.name
    elif user.hospital_profile:
        name = user.hospital_profile.hospital_name

    token = create_access_token({"sub": user.id})
    return TokenResponse(
        access_token=token,
        user={"id": user.id, "email": user.email, "role": user.role.value, "name": name},
    )


@router.post("/register/donor", response_model=TokenResponse, status_code=201)
async def register_donor(data: RegisterDonor, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=data.email,
        password_hash=get_password_hash(data.password),
        role=UserRole.donor,
    )
    db.add(user)
    await db.flush()

    dob = None
    if data.date_of_birth:
        try:
            dob = datetime.strptime(data.date_of_birth, "%Y-%m-%d")
        except ValueError:
            pass

    last_donation = None
    if data.last_donation_date:
        try:
            last_donation = datetime.strptime(data.last_donation_date, "%Y-%m-%d")
        except ValueError:
            pass

    profile = DonorProfile(
        user_id=user.id,
        name=data.name,
        blood_type=data.blood_type,
        phone=data.phone,
        national_id=data.national_id,
        date_of_birth=dob,
        weight_kg=data.weight_kg,
        city=data.city,
        latitude=data.latitude,
        longitude=data.longitude,
        last_donation=last_donation,
        medical_notes=data.medical_notes,
    )
    db.add(profile)
    await db.commit()

    token = create_access_token({"sub": user.id})
    return TokenResponse(
        access_token=token,
        user={"id": user.id, "email": user.email, "role": user.role.value, "name": data.name},
    )


@router.post("/register/hospital", response_model=TokenResponse, status_code=201)
async def register_hospital(data: RegisterHospital, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=data.email,
        password_hash=get_password_hash(data.password),
        role=UserRole.hospital,
    )
    db.add(user)
    await db.flush()

    profile = HospitalProfile(
        user_id=user.id,
        hospital_name=data.hospital_name,
        facility_type=data.facility_type,
        license_number=data.license_number,
        contact_phone=data.contact_phone,
        address=data.address,
        city=data.city,
        latitude=data.latitude,
        longitude=data.longitude,
    )
    db.add(profile)
    await db.commit()

    token = create_access_token({"sub": user.id})
    return TokenResponse(
        access_token=token,
        user={"id": user.id, "email": user.email, "role": user.role.value, "name": data.hospital_name},
    )
