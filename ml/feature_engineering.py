import pandas as pd

AS_OF_DATE = pd.Timestamp("2026-08-31")


def prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # Convert dates
    df["sanction_date"] = pd.to_datetime(
        df["sanction_date"], errors="coerce"
    )

    df["original_completion"] = pd.to_datetime(
        df["original_completion"], errors="coerce"
    )

    # Remove rows where important dates are missing
    df = df.dropna(
        subset=["sanction_date", "original_completion"]
    ).copy()

    # Feature 1: expenditure ratio
    df["expenditure_ratio"] = (
        df["expenditure"] / df["original_cost"]
    )

    # Feature 2: project age
    df["project_age_days"] = (
        AS_OF_DATE - df["sanction_date"]
    ).dt.days

    # Feature 3: time remaining
    df["time_remaining_days"] = (
        df["original_completion"] - AS_OF_DATE
    ).dt.days

    # Avoid impossible numeric values
    df["expenditure_ratio"] = (
        df["expenditure_ratio"]
        .replace([float("inf"), -float("inf")], pd.NA)
        .fillna(0)
    )

    # Categorical columns
    for col in ["sector", "ministry", "agency"]:
        df[col] = df[col].fillna("Unknown").astype(str)

    return df