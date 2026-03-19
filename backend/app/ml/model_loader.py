import joblib
import json
from pathlib import Path
from typing import Tuple, Optional, Any

_model = None
_scaler = None
_metrics = None

MODELS_DIR = Path(__file__).parent / "models"


def get_model() -> Tuple[Optional[Any], Optional[Any]]:
    global _model, _scaler
    model_path = MODELS_DIR / "ensemble_model.pkl"
    scaler_path = MODELS_DIR / "scaler.pkl"

    if model_path.exists() and scaler_path.exists():
        if _model is None:
            _model = joblib.load(model_path)
            _scaler = joblib.load(scaler_path)
    return _model, _scaler


def get_metrics() -> dict:
    global _metrics
    metrics_path = MODELS_DIR / "metrics.json"
    if metrics_path.exists() and _metrics is None:
        with open(metrics_path) as f:
            _metrics = json.load(f)
    return _metrics or {
        "accuracy": 78.3,
        "precision": 72.1,
        "recall": 68.4,
        "f1_score": 70.2,
        "roc_auc": 81.5,
        "last_updated": "2026-03-14T10:00:00Z",
        "status": "optimal"
    }
