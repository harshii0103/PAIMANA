import pandas as pd
from catboost import CatBoostClassifier

from feature_engineering import prepare_features
from risk_engine import calculate_cost_risk


MODEL_PATH = "models/cost_catboost.cbm"
DATA_PATH = "ml/data/processed/paimana_cost_model.csv"

# Load
df = pd.read_csv(DATA_PATH)
df = prepare_features(df)

# Features
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

# Load model
model = CatBoostClassifier()
model.load_model(MODEL_PATH)

# Test first project
project = df[df["cost_overrun"] == 1].iloc[[0]]
X = project[features]

# Prediction
probability = model.predict_proba(X)[0][1]

# Risk
result = calculate_cost_risk(probability)

print("\n===== COST RISK =====")
print("Project:", project["project_name"].iloc[0])
print("Probability:", result["cost_risk_percent"], "%")
print("Risk Level:", result["risk_level"])