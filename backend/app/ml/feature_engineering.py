import numpy as np
import pandas as pd


def _recency_category(recency: int) -> int:
    if recency <= 2:
        return 4
    elif recency <= 6:
        return 3
    elif recency <= 12:
        return 2
    elif recency <= 24:
        return 1
    else:
        return 0


def engineer_features(recency: int, frequency: int, monetary: int, time: int) -> pd.DataFrame:
    """
    Replicates the feature engineering from the training script.
    Must match training-time feature transforms exactly.
    """
    features = {
        'Recency': recency,
        'Frequency': frequency,
        'Monetary': monetary,
        'Time': time,
        'Donation_Rate': frequency / (time + 1),
        'Recency_Time_Ratio': recency / (time + 1),
        'Avg_Donation_Volume': monetary / (frequency + 1),
        'Consistency_Score': frequency / (time - recency + 1) if (time - recency + 1) > 0 else 0,
        'Engagement_Score': frequency * (1 / (recency + 1)),
        'Weighted_Time': time - recency,
        'Loyalty_Index': time / (recency + 1),
        'Freq_Recency_Interaction': frequency * (1 / (recency + 1)),
        'Log_Monetary': np.log1p(monetary),
        'Log_Frequency': np.log1p(frequency),
        'Recency_Squared': recency ** 2,
        'Frequency_Squared': frequency ** 2,
        'Recency_Category': _recency_category(recency),
    }
    df = pd.DataFrame([features])
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.fillna(df.median(numeric_only=True), inplace=True)
    return df
