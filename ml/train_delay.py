import pandas as pd
from catboost import CatBoostClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
)

from feature_engineering import prepare_features


# -----------------------------------------
# Paths
# -----------------------------------------

SOURCE_PATH = "ml/data/processed/paimana_cleaned.csv"
OUTPUT_PATH = "ml/data/processed/paimana_delay_model.csv"
MODEL_PATH = "models/delay_catboost.cbm"


# -----------------------------------------
# 1. Load cleaned dataset
# -----------------------------------------

df = pd.read_csv(SOURCE_PATH)

print("Original dataset shape:", df.shape)


# -----------------------------------------
# 2. Convert completion dates
# -----------------------------------------

df["original_completion"] = pd.to_datetime(
    df["original_completion"],
    errors="coerce"
)

df["revised_completion"] = pd.to_datetime(
    df["revised_completion"],
    errors="coerce"
)


# -----------------------------------------
# 3. Remove rows with unknown delay outcome
# -----------------------------------------

df = df.dropna(
    subset=[
        "original_completion",
        "revised_completion"
    ]
).copy()


# -----------------------------------------
# 4. Create delay target
# -----------------------------------------

df["delay_overrun"] = (
    df["revised_completion"] > df["original_completion"]
).astype(int)


# -----------------------------------------
# 5. Save delay-model dataset
# -----------------------------------------

df.to_csv(
    OUTPUT_PATH,
    index=False
)

print("Delay model dataset saved.")
print("Delay dataset shape:", df.shape)

print("\nDelay target distribution:")
print(df["delay_overrun"].value_counts())

print("\nDelay target percentage:")
print(
    df["delay_overrun"]
    .value_counts(normalize=True)
    .mul(100)
    .round(2)
)


# -----------------------------------------
# 6. Feature engineering
# -----------------------------------------

df = prepare_features(df)


# -----------------------------------------
# 7. Select features
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

X = df[features]
y = df["delay_overrun"]


# -----------------------------------------
# 8. Categorical features
# -----------------------------------------

categorical_features = [
    "sector",
    "ministry",
    "agency"
]


# -----------------------------------------
# 9. Train-test split
# -----------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# -----------------------------------------
# 10. CatBoost model
# -----------------------------------------

model = CatBoostClassifier(
    iterations=300,
    depth=6,
    learning_rate=0.05,
    loss_function="Logloss",
    random_seed=42,
    verbose=False
)


# -----------------------------------------
# 11. Train
# -----------------------------------------

model.fit(
    X_train,
    y_train,
    cat_features=categorical_features
)


# -----------------------------------------
# 12. Predictions
# -----------------------------------------

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]


# -----------------------------------------
# 13. Evaluation
# -----------------------------------------

accuracy = accuracy_score(y_test, y_pred)

precision = precision_score(
    y_test,
    y_pred,
    zero_division=0
)

recall = recall_score(
    y_test,
    y_pred,
    zero_division=0
)

f1 = f1_score(
    y_test,
    y_pred,
    zero_division=0
)

roc_auc = roc_auc_score(
    y_test,
    y_prob
)

cm = confusion_matrix(
    y_test,
    y_pred
)


# -----------------------------------------
# 14. Print results
# -----------------------------------------

print("\n======================================")
print("         DELAY RISK MODEL")
print("======================================")

print(f"Accuracy:  {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall:    {recall:.4f}")
print(f"F1 Score:  {f1:.4f}")
print(f"ROC-AUC:   {roc_auc:.4f}")

print("\nConfusion Matrix:")
print(cm)


# -----------------------------------------
# 15. Save model
# -----------------------------------------

model.save_model(MODEL_PATH)

print("\nModel saved to:")
print(MODEL_PATH)