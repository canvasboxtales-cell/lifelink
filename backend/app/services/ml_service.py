from app.ml.model_loader import get_model
from app.ml.feature_engineering import engineer_features


def predict_donation_probability(recency: int, frequency: int, monetary: int, time_months: int) -> float:
    """Returns probability (0.0-1.0) that a donor will donate."""
    model, scaler, selector, threshold = get_model()

    if model is None:
        # Fallback heuristic when model not loaded
        recency_factor = max(0, 1 - recency / 24)
        frequency_factor = min(1, frequency / 20)
        return round(0.3 * recency_factor + 0.4 * frequency_factor + 0.3 * 0.5, 3)

    features_df = engineer_features(recency, frequency, monetary, time_months)
    scaled = scaler.transform(features_df)
    selected = selector.transform(scaled)
    prob = float(model.predict_proba(selected)[0][1])
    return prob


def get_prediction_threshold() -> float:
    _, _, _, threshold = get_model()
    return threshold


def compute_match_score(
    donation_probability: float,
    distance_km: float,
    response_rate: float,
    blood_compatibility: float,
) -> float:
    """
    Composite score (0-100) combining ML prediction with real-world factors.
    Weights: ML prob 40%, blood compatibility 30%, proximity 20%, response rate 10%
    """
    proximity_score = max(0.0, 1.0 - (distance_km / 50.0))
    score = (
        donation_probability * 0.40 +
        blood_compatibility * 0.30 +
        proximity_score * 0.20 +
        (response_rate / 100.0) * 0.10
    )
    return round(score * 100, 1)


def generate_ai_recommendation(response_rate: float, distance_km: float, match_score: float) -> str:
    quality = 'excellent' if response_rate >= 90 else 'good'
    return (
        f"High compatibility based on blood type, "
        f"proximity ({distance_km:.1f}km), and "
        f"{quality} response history "
        f"({response_rate:.0f}% response rate)"
    )
