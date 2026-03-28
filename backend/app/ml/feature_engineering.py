import numpy as np
import pandas as pd


def engineer_features(recency: int, frequency: int, monetary: int, time_months: int) -> pd.DataFrame:
    eps = 1
    t = time_months if time_months > recency else recency + 1
    active_period = t - recency

    donation_rate = frequency / (t + eps)
    recency_freq_ratio = recency / (frequency + eps)
    engagement = frequency / (recency + eps)
    loyalty = t / (recency + eps)
    avg_gap = active_period / (frequency + eps)
    consistency = frequency / (active_period + eps)
    recent_donor = 1 if recency <= 4 else 0
    frequent_donor = 1 if frequency >= 6 else 0
    recency_sq = recency ** 2
    log_freq = np.log1p(frequency)
    recent_x_frequent = recent_donor * frequent_donor

    features = {
        "Recency": recency,
        "Frequency": frequency,
        "Monetary": monetary,
        "Time": time_months,
        "Donation_Rate": donation_rate,
        "Recency_Freq_Ratio": recency_freq_ratio,
        "Active_Period": active_period,
        "Engagement": engagement,
        "Loyalty": loyalty,
        "Avg_Gap": avg_gap,
        "Consistency": consistency,
        "Recent_Donor": recent_donor,
        "Frequent_Donor": frequent_donor,
        "Recency_Sq": recency_sq,
        "Log_Freq": log_freq,
        "Recent_x_Frequent": recent_x_frequent
    }

    cols_order = [
        "Recency", "Frequency", "Monetary", "Time", "Donation_Rate", "Recency_Freq_Ratio",
        "Active_Period", "Engagement", "Loyalty", "Avg_Gap", "Consistency", "Recent_Donor",
        "Frequent_Donor", "Recency_Sq", "Log_Freq", "Recent_x_Frequent"
    ]

    df = pd.DataFrame([features], columns=cols_order)
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.fillna(df.median(numeric_only=True), inplace=True)
    return df
