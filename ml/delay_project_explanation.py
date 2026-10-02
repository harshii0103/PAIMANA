import json
import pandas as pd
from catboost import CatBoostClassifier

from feature_engineering import prepare_features
from risk_engine import get_risk_level


# -----------------------------------------
# Paths
# -----------------------------------------

DATA_PATH = "ml/data/processed/paimana_delay_model.csv"
MODEL_PATH = "models/delay_catboost.cbm"
IMPORTANCE_PATH = "ml/data/processed/delay_feature_importance.csv"

AS_OF_DATE = pd.Timestamp("2026-08-31")


# -----------------------------------------
# 1. Load data
# -----------------------------------------

df = pd.read_csv(DATA_PATH)

df = prepare_features(df)


# -----------------------------------------
# 2. Load model
# -----------------------------------------

model = CatBoostClassifier()
model.load_model(MODEL_PATH)


# -----------------------------------------
# 3. Load feature importance
# -----------------------------------------

importance = pd.read_csv(IMPORTANCE_PATH)

importance = importance.sort_values(
    "importance",
    ascending=False
)


# -----------------------------------------
# 4. Select a delayed project for testing
# -----------------------------------------

project = df[df["delay_overrun"] == 1].iloc[[0]].copy()

p = project.iloc[0]


# -----------------------------------------
# 5. Model features
# -----------------------------------------

features = [
    "original_cost",
    "expenditure",
    "physical_progress",
    "expenditure_ratio",
    "project_age_days",
    "time_remaining_days",
    "sector",
    "ministry",
    "agency"
]

X_project = project[features]


# -----------------------------------------
# 6. Predict delay risk
# -----------------------------------------

probability = model.predict_proba(X_project)[0][1]

risk_level = get_risk_level(probability)


# -----------------------------------------
# 7. Dataset reference values
# -----------------------------------------

median_physical_progress = df[
    "physical_progress"
].median()

median_project_age = df[
    "project_age_days"
].median()

median_time_remaining = df[
    "time_remaining_days"
].median()


# -----------------------------------------
# 8. Build risk indicators
# -----------------------------------------

risk_indicators = []


# ---- Schedule Status ----

if p["time_remaining_days"] < 0:

    overdue_days = abs(
        int(p["time_remaining_days"])
    )

    risk_indicators.append({
        "factor": "Schedule Status",
        "severity": "CRITICAL",
        "value": int(p["time_remaining_days"]),
        "reference": 0,
        "message": (
            f"Project is already beyond its "
            f"original completion date by approximately "
            f"{overdue_days} days."
        )
    })

elif p["time_remaining_days"] < median_time_remaining:

    risk_indicators.append({
        "factor": "Time Remaining",
        "severity": "HIGH",
        "value": int(p["time_remaining_days"]),
        "reference": int(median_time_remaining),
        "message": (
            f"Time remaining ({p['time_remaining_days']:.0f} days) "
            f"is below the dataset median "
            f"({median_time_remaining:.0f} days)."
        )
    })


# ---- Physical Progress ----

if p["physical_progress"] < median_physical_progress:

    risk_indicators.append({
        "factor": "Physical Progress",
        "severity": "HIGH",
        "value": round(float(p["physical_progress"]), 2),
        "reference": round(float(median_physical_progress), 2),
        "message": (
            f"Physical progress ({p['physical_progress']:.1f}%) "
            f"is below the dataset median "
            f"({median_physical_progress:.1f}%)."
        )
    })


# ---- Project Age ----

if p["project_age_days"] > median_project_age:

    risk_indicators.append({
        "factor": "Project Age",
        "severity": "MEDIUM",
        "value": int(p["project_age_days"]),
        "reference": int(median_project_age),
        "message": (
            f"Project age ({p['project_age_days']:.0f} days) "
            f"is above the dataset median "
            f"({median_project_age:.0f} days)."
        )
    })


# -----------------------------------------
# 9. Top model-important features
# -----------------------------------------

top_features = []

for _, row in importance.head(5).iterrows():

    # Ignore tiny negative/near-zero importance
    if row["importance"] > 0:

        top_features.append({
            "feature": row["feature"],
            "importance": round(
                float(row["importance"]),
                6
            )
        })


# -----------------------------------------
# 10. Dashboard-ready JSON
# -----------------------------------------

report = {
    "project": {
        "project_name": p["project_name"],
        "project_code": str(p["project_code"]),
        "sector": p["sector"],
        "ministry": p["ministry"],
        "agency": p["agency"]
    },

    "risk": {
        "delay_risk_probability": round(
            float(probability),
            4
        ),
        "delay_risk_percent": round(
            float(probability) * 100,
            2
        ),
        "risk_level": risk_level
    },

    "project_indicators": {
        "physical_progress": round(
            float(p["physical_progress"]),
            2
        ),
        "project_age_days": int(
            p["project_age_days"]
        ),
        "time_remaining_days": int(
            p["time_remaining_days"]
        ),
        "expenditure_ratio": round(
            float(p["expenditure_ratio"]),
            2
        )
    },

    "risk_indicators": risk_indicators,

    "top_model_features": top_features,

    "as_of_date": AS_OF_DATE.strftime(
        "%Y-%m-%d"
    )
}


# -----------------------------------------
# 11. Save JSON
# -----------------------------------------

output_path = (
    "ml/data/processed/"
    f"project_delay_risk_report_{p['project_code']}.json"
)

with open(
    output_path,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        report,
        f,
        indent=4
    )


# -----------------------------------------
# 12. Terminal output
# -----------------------------------------

print("\n======================================")
print("       PROJECT DELAY RISK REPORT")
print("======================================")

print("\nProject:")
print(p["project_name"])

print("\nProject Code:")
print(p["project_code"])

print("\nDelay Risk:")
print(f"{probability * 100:.2f}%")

print("Risk Level:")
print(risk_level)


print("\n--------------------------------------")
print("PROJECT INDICATORS")
print("--------------------------------------")

print(
    f"Physical Progress: "
    f"{p['physical_progress']:.2f}%"
)

print(
    f"Project Age: "
    f"{p['project_age_days']:.0f} days"
)

print(
    f"Time Remaining: "
    f"{p['time_remaining_days']:.0f} days"
)

print(
    f"Expenditure Ratio: "
    f"{p['expenditure_ratio']:.2f}"
)


print("\n--------------------------------------")
print("RISK INDICATORS")
print("--------------------------------------")

if risk_indicators:

    for i, indicator in enumerate(
        risk_indicators,
        1
    ):

        print(
            f"{i}. [{indicator['severity']}] "
            f"{indicator['message']}"
        )

else:

    print(
        "No major delay indicators detected."
    )


print("\n--------------------------------------")
print("TOP MODEL-IMPORTANT FEATURES")
print("--------------------------------------")

for i, feature in enumerate(
    top_features,
    1
):

    print(
        f"{i}. {feature['feature']} "
        f"({feature['importance']:.4f})"
    )


print("\n--------------------------------------")
print("JSON REPORT")
print("--------------------------------------")

print(
    f"Saved to: {output_path}"
)