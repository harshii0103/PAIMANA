import pandas as pd
from catboost import CatBoostClassifier
from sklearn.model_selection import train_test_split
from sklearn.inspection import permutation_importance

from feature_engineering import prepare_features


# Load data
df = pd.read_csv(
    "ml/data/processed/paimana_cost_model.csv"
)

# Feature engineering
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

X = df[features]
y = df["cost_overrun"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# Categorical features
cat_features = [
    "sector",
    "ministry",
    "agency"
]

# Train CatBoost
model = CatBoostClassifier(
    iterations=300,
    depth=6,
    learning_rate=0.05,
    loss_function="Logloss",
    random_seed=42,
    verbose=False
)

model.fit(
    X_train,
    y_train,
    cat_features=cat_features
)

# Permutation Importance
result = permutation_importance(
    model,
    X_test,
    y_test,
    n_repeats=10,
    random_state=42,
    scoring="f1"
)

importance = pd.DataFrame({
    "feature": X_test.columns,
    "importance": result.importances_mean
}).sort_values(
    "importance",
    ascending=False
)

print("\n===== PERMUTATION IMPORTANCE =====")
print(importance.to_string(index=False))
importance.to_csv(
    "ml/data/processed/cost_feature_importance.csv",
    index=False
)

print("\nSaved:")
print("ml/data/processed/cost_feature_importance.csv")