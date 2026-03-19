from pydantic import BaseModel
from typing import Dict, List, Optional


class TrendPoint(BaseModel):
    month: str
    donations: int
    matches: int


class ActivityItem(BaseModel):
    type: str
    description: str
    detail: str
    time_ago: str


class DashboardStats(BaseModel):
    total_donors: int
    active_requests: int
    successful_matches: int
    system_accuracy: float
    accuracy_change: float
    donors_change: float
    donation_trends: List[TrendPoint]
    blood_type_distribution: Dict[str, int]
    recent_activity: List[ActivityItem]


class ModelMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: Optional[float] = None
    last_updated: str
    status: str


class PaginatedDonors(BaseModel):
    donors: list
    total: int
    page: int
    per_page: int
    pages: int
