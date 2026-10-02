import json
import sys
import pandas as pd
from catboost import CatBoostClassifier

from feature_engineering import prepare_features
from risk_engine import get_risk_level


# -----------------------------------------
# Paths
# -----------------------------------------

DATA_PATH = "ml/data/processed/paimana_cleaned.csv"

COST_MODEL_PATH = "models/cost_catboost.cbm"
DELAY_MODEL_PATH = "models/delay_catboost.cbm"

OUTPUT_PATH = "ml/data/processed/project_risk_report.json"


# -----------------------------------------
# Project code
# -----------------------------------------

if len(sys.argv) > 1:
    project_code = str(sys.argv[1])
else:
    project_code = "706718"


# -----------------------------------------
# Load dataset
# -----------------------------------------

df = pd.read_csv(DATA_PATH)

df["project_code"] = df["project_code"].astype(str)


# -----------------------------------------
# Find project
# -----------------------------------------

project = df[
    df["project_code"] == project_code
].copy()


if project.empty:
    print(
        f"\nProject code {project_code} was not found."
    )
    sys.exit()


# -----------------------------------------
# Feature engineering
# -----------------------------------------

project = prepare_features(project)


# -----------------------------------------
# Features
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

X = project[features]


# -----------------------------------------
# Load models
# -----------------------------------------

cost_model = CatBoostClassifier()
cost_model.load_model(COST_MODEL_PATH)

delay_model = CatBoostClassifier()
delay_model.load_model(DELAY_MODEL_PATH)


# -----------------------------------------
# Predictions
# -----------------------------------------

cost_probability = cost_model.predict_proba(X)[0][1]

delay_probability = delay_model.predict_proba(X)[0][1]


# -----------------------------------------
# Risk levels
# -----------------------------------------

cost_level = get_risk_level(
    cost_probability
)

delay_level = get_risk_level(
    delay_probability
)


# -----------------------------------------
# Overall risk
# -----------------------------------------

overall_probability = (
    0.5 * cost_probability
    + 0.5 * delay_probability
)

overall_level = get_risk_level(
    overall_probability
)


# -----------------------------------------
# Project information
# -----------------------------------------

p = project.iloc[0]


# -----------------------------------------
# Final report
# -----------------------------------------

report = {
    "project": {
        "project_code": str(
            p["project_code"]
        ),
        "project_name": p["project_name"],
        "sector": p["sector"],
        "ministry": p["ministry"],
        "agency": p["agency"]
    },

    "project_indicators": {
        "original_cost": round(
            float(p["original_cost"]),
            2
        ),
        "expenditure": round(
            float(p["expenditure"]),
            2
        ),
        "physical_progress": round(
            float(p["physical_progress"]),
            2
        ),
        "expenditure_ratio": round(
            float(p["expenditure_ratio"]),
            2
        ),
        "project_age_days": int(
            p["project_age_days"]
        ),
        "time_remaining_days": int(
            p["time_remaining_days"]
        )
    },

    "cost_risk": {
        "probability": round(
            float(cost_probability),
            4
        ),
        "percentage": round(
            float(cost_probability) * 100,
            2
        ),
        "risk_level": cost_level
    },

    "delay_risk": {
        "probability": round(
            float(delay_probability),
            4
        ),
        "percentage": round(
            float(delay_probability) * 100,
            2
        ),
        "risk_level": delay_level
    },

    "overall_risk": {
        "probability": round(
            float(overall_probability),
            4
        ),
        "percentage": round(
            float(overall_probability) * 100,
            2
        ),
        "risk_level": overall_level
    },

    "as_of_date": "2026-08-31"
}


# -----------------------------------------
# Save JSON
# -----------------------------------------

with open(
    OUTPUT_PATH,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        report,
        f,
        indent=4
    )


# -----------------------------------------
# Display
# -----------------------------------------

print("\n======================================")
print("       PROJECT RISK REPORT")
print("======================================")

print("\nProject:")
print(p["project_name"])

print("\nProject Code:")
print(p["project_code"])


print("\n--------------------------------------")
print("COST RISK")
print("--------------------------------------")

print(
    f"Risk: {cost_probability * 100:.2f}%"
)

print(
    f"Level: {cost_level}"
)


print("\n--------------------------------------")
print("DELAY RISK")
print("--------------------------------------")

print(
    f"Risk: {delay_probability * 100:.2f}%"
)

print(
    f"Level: {delay_level}"
)


print("\n--------------------------------------")
print("OVERALL PROJECT RISK")
print("--------------------------------------")

print(
    f"Risk: {overall_probability * 100:.2f}%"
)

print(
    f"Level: {overall_level}"
)


print("\n--------------------------------------")
print("REPORT")
print("--------------------------------------")

print(
    f"Saved to: {OUTPUT_PATH}"
)