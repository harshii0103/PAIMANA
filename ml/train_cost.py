import os
import pandas as pd

from catboost import CatBoostClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
)

from feature_engineering import prepare_features


# ==========================================
# 1. Load cost-model dataset
# ==========================================

INPUT_FILE = "ml/data/processed/paimana_cost_model.csv"

df = pd.read_csv(INPUT_FILE)

print("Dataset shape:", df.shape)


# ==========================================
# 2. Feature engineering
# ==========================================

df = prepare_features(df)


# ==========================================
# 3. Select features
# ==========================================

features = [
    "original_cost",
    "expenditure",
    "physical_progress",
    "expenditure_ratio",
    "project_age_days",
    "time_remaining_days",
    "sector",
    "ministry",
    "agency",
]

X = df[features]
y = df["cost_overrun"]


# ==========================================
# 4. Train / Test split
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)


# ==========================================
# 5. Categorical columns
# ==========================================

cat_features = [
    "sector",
    "ministry",
    "agency",
]


# ==========================================
# 6. CatBoost model
# ==========================================

model = CatBoostClassifier(
    iterations=300,
    depth=6,
    learning_rate=0.05,
    loss_function="Logloss",
    random_seed=42,
    verbose=False,
)

model.fit(
    X_train,
    y_train,
    cat_features=cat_features,
)


# ==========================================
# 7. Predictions
# ==========================================

predictions = model.predict(X_test)
probabilities = model.predict_proba(X_test)[:, 1]


# ==========================================
# 8. Evaluation
# ==========================================

print("\n===== MODEL RESULTS =====")

print("Accuracy :", round(
    accuracy_score(y_test, predictions), 4
))

print("Precision:", round(
    precision_score(y_test, predictions), 4
))

print("Recall   :", round(
    recall_score(y_test, predictions), 4
))

print("F1 Score :", round(
    f1_score(y_test, predictions), 4
))

print("ROC-AUC  :", round(
    roc_auc_score(y_test, probabilities), 4
))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, predictions))


# ==========================================
# 9. Save model
# ==========================================

os.makedirs("models", exist_ok=True)

MODEL_PATH = "models/cost_catboost.cbm"

model.save_model(MODEL_PATH)

print("\nModel saved:", MODEL_PATH)