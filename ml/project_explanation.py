import json
import pandas as pd
from catboost import CatBoostClassifier

from feature_engineering import prepare_features
from risk_engine import calculate_cost_risk


# -----------------------------------------
# Paths
# -----------------------------------------

DATA_PATH = "ml/data/processed/paimana_cost_model.csv"
MODEL_PATH = "models/cost_catboost.cbm"
IMPORTANCE_PATH = "ml/data/processed/cost_feature_importance.csv"

AS_OF_DATE = pd.Timestamp("2026-08-31")


# -----------------------------------------
# 1. Load data
# -----------------------------------------

df = pd.read_csv(DATA_PATH)
df = prepare_features(df)

model = CatBoostClassifier()
model.load_model(MODEL_PATH)

importance = pd.read_csv(IMPORTANCE_PATH)
importance = importance.sort_values(
    "importance",
    ascending=False
)


# -----------------------------------------
# 2. Select project
# -----------------------------------------

project = df[df["cost_overrun"] == 1].iloc[[0]].copy()

p = project.iloc[0]

X_project = project[[
    "original_cost",
    "expenditure",
    "physical_progress",
    "expenditure_ratio",
    "project_age_days",
    "time_remaining_days",
    "sector",
    "ministry",
    "agency"
]]


# -----------------------------------------
# 3. Predict cost risk
# -----------------------------------------

probability = model.predict_proba(X_project)[0][1]

risk = calculate_cost_risk(probability)


# -----------------------------------------
# 4. Dataset reference values
# -----------------------------------------

median_expenditure_ratio = df["expenditure_ratio"].median()
median_progress = df["physical_progress"].median()
median_project_age = df["project_age_days"].median()
median_time_remaining = df["time_remaining_days"].median()


# -----------------------------------------
# 5. Build risk indicators
# -----------------------------------------

risk_indicators = []


# ---- Expenditure Ratio ----

if p["expenditure_ratio"] > median_expenditure_ratio:

    severity = "HIGH"

    risk_indicators.append({
        "factor": "Expenditure Ratio",
        "severity": severity,
        "value": round(float(p["expenditure_ratio"]), 2),
        "reference": round(float(median_expenditure_ratio), 2),
        "message": (
            f"Expenditure ratio ({p['expenditure_ratio']:.2f}) "
            f"is above the dataset median "
            f"({median_expenditure_ratio:.2f})."
        )
    })


# ---- Project Age ----

if p["project_age_days"] > median_project_age:

    severity = "MEDIUM"

    risk_indicators.append({
        "factor": "Project Age",
        "severity": severity,
        "value": int(p["project_age_days"]),
        "reference": int(median_project_age),
        "message": (
            f"Project age ({p['project_age_days']:.0f} days) "
            f"is above the dataset median "
            f"({median_project_age:.0f} days)."
        )
    })


# ---- Time Remaining ----

if p["time_remaining_days"] < 0:

    severity = "CRITICAL"

    overdue_days = abs(int(p["time_remaining_days"]))

    risk_indicators.append({
        "factor": "Schedule Status",
        "severity": severity,
        "value": int(p["time_remaining_days"]),
        "reference": 0,
        "message": (
            f"Project is overdue by approximately "
            f"{overdue_days} days based on the original completion date."
        )
    })

elif p["time_remaining_days"] < median_time_remaining:

    severity = "HIGH"

    risk_indicators.append({
        "factor": "Time Remaining",
        "severity": severity,
        "value": int(p["time_remaining_days"]),
        "reference": int(median_time_remaining),
        "message": (
            f"Time remaining ({p['time_remaining_days']:.0f} days) "
            f"is below the dataset median "
            f"({median_time_remaining:.0f} days)."
        )
    })


# -----------------------------------------
# 6. Top model-important features
# -----------------------------------------

top_features = []

for _, row in importance.head(5).iterrows():

    top_features.append({
        "feature": row["feature"],
        "importance": round(float(row["importance"]), 6)
    })


# -----------------------------------------
# 7. Dashboard-ready JSON
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
        "cost_risk_probability": round(float(probability), 4),
        "cost_risk_percent": round(float(probability) * 100, 2),
        "risk_level": risk["risk_level"]
    },

    "project_indicators": {
        "original_cost": round(float(p["original_cost"]), 2),
        "expenditure": round(float(p["expenditure"]), 2),
        "physical_progress": round(float(p["physical_progress"]), 2),
        "expenditure_ratio": round(float(p["expenditure_ratio"]), 2),
        "project_age_days": int(p["project_age_days"]),
        "time_remaining_days": int(p["time_remaining_days"])
    },

    "risk_indicators": risk_indicators,

    "top_model_features": top_features,

    "as_of_date": AS_OF_DATE.strftime("%Y-%m-%d")
}


# -----------------------------------------
# 8. Save JSON
# -----------------------------------------

output_path = (
    f"ml/data/processed/"
    f"project_cost_risk_report_{p['project_code']}.json"
)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(report, f, indent=4)


# -----------------------------------------
# 9. Terminal output
# -----------------------------------------

print("\n======================================")
print("       PROJECT COST RISK REPORT")
print("======================================")

print("\nProject:")
print(p["project_name"])

print("\nProject Code:")
print(p["project_code"])

print("\nCost Overrun Risk:")
print(f"{probability * 100:.2f}%")

print("Risk Level:")
print(risk["risk_level"])


print("\n--------------------------------------")
print("PROJECT INDICATORS")
print("--------------------------------------")

print(f"Original Cost: ₹{p['original_cost']:,.2f} Cr")
print(f"Expenditure: ₹{p['expenditure']:,.2f} Cr")
print(f"Physical Progress: {p['physical_progress']:.2f}%")
print(f"Expenditure Ratio: {p['expenditure_ratio']:.2f}")
print(f"Project Age: {p['project_age_days']:.0f} days")
print(f"Time Remaining: {p['time_remaining_days']:.0f} days")


print("\n--------------------------------------")
print("RISK INDICATORS")
print("--------------------------------------")

if risk_indicators:

    for i, indicator in enumerate(risk_indicators, 1):

        print(
            f"{i}. [{indicator['severity']}] "
            f"{indicator['message']}"
        )

else:
    print("No major risk indicators detected.")


print("\n--------------------------------------")
print("TOP MODEL-IMPORTANT FEATURES")
print("--------------------------------------")

for i, feature in enumerate(top_features, 1):

    print(
        f"{i}. {feature['feature']} "
        f"({feature['importance']:.4f})"
    )


print("\n--------------------------------------")
print("JSON REPORT")
print("--------------------------------------")

print(f"Saved to: {output_path}")