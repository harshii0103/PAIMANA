import pandas as pd
from catboost import CatBoostClassifier
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split

from feature_engineering import prepare_features


DATA_PATH = "ml/data/processed/paimana_delay_model.csv"
MODEL_PATH = "models/delay_catboost.cbm"
OUTPUT_PATH = "ml/data/processed/delay_feature_importance.csv"


# -----------------------------------------
# 1. Load data
# -----------------------------------------

df = pd.read_csv(DATA_PATH)

df = prepare_features(df)


# -----------------------------------------
# 2. Features
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
# 3. Train-test split
# -----------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# -----------------------------------------
# 4. Load trained model
# -----------------------------------------

model = CatBoostClassifier()
model.load_model(MODEL_PATH)


# -----------------------------------------
# 5. Permutation Importance
# -----------------------------------------

result = permutation_importance(
    model,
    X_test,
    y_test,
    n_repeats=10,
    random_state=42,
    scoring="f1"
)


# -----------------------------------------
# 6. Create importance table
# -----------------------------------------

importance = pd.DataFrame({
    "feature": features,
    "importance": result.importances_mean
})

importance = importance.sort_values(
    "importance",
    ascending=False
)


# -----------------------------------------
# 7. Save results
# -----------------------------------------

importance.to_csv(
    OUTPUT_PATH,
    index=False
)


# -----------------------------------------
# 8. Display results
# -----------------------------------------

print("\n======================================")
print("      DELAY MODEL FEATURE IMPORTANCE")
print("======================================")

for _, row in importance.iterrows():
    print(
        f"{row['feature']}: "
        f"{row['importance']:.6f}"
    )

print("\nSaved to:")
print(OUTPUT_PATH)