import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)

from catboost import CatBoostClassifier
from feature_engineering import prepare_features


# ==========================================
# 1. Load data
# ==========================================

df = pd.read_csv(
    "ml/data/processed/paimana_cost_model.csv"
)

df = prepare_features(df)


# ==========================================
# 2. Features
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
    "agency"
]

X = df[features]
y = df["cost_overrun"]


# ==========================================
# 3. Split
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ==========================================
# 4. Categorical / numerical columns
# ==========================================

categorical = [
    "sector",
    "ministry",
    "agency"
]

numeric = [
    "original_cost",
    "expenditure",
    "physical_progress",
    "expenditure_ratio",
    "project_age_days",
    "time_remaining_days"
]


# ==========================================
# 5. Preprocessing for Logistic / RF
# ==========================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "num",
            SimpleImputer(strategy="median"),
            numeric
        ),
        (
            "cat",
            Pipeline([
                (
                    "imputer",
                    SimpleImputer(strategy="most_frequent")
                ),
                (
                    "onehot",
                    OneHotEncoder(
                        handle_unknown="ignore"
                    )
                )
            ]),
            categorical
        )
    ]
)


# ==========================================
# 6. Logistic Regression
# ==========================================

logistic_model = Pipeline([
    ("preprocessor", preprocessor),
    ("model", LogisticRegression(
        max_iter=1000,
        random_state=42
    ))
])

logistic_model.fit(X_train, y_train)

lr_pred = logistic_model.predict(X_test)
lr_prob = logistic_model.predict_proba(X_test)[:, 1]


# ==========================================
# 7. Random Forest
# ==========================================

rf_model = Pipeline([
    ("preprocessor", preprocessor),
    ("model", RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced"
    ))
])

rf_model.fit(X_train, y_train)

rf_pred = rf_model.predict(X_test)
rf_prob = rf_model.predict_proba(X_test)[:, 1]


# ==========================================
# 8. CatBoost
# ==========================================

cat_features = [
    "sector",
    "ministry",
    "agency"
]

cat_model = CatBoostClassifier(
    iterations=300,
    depth=6,
    learning_rate=0.05,
    loss_function="Logloss",
    random_seed=42,
    verbose=False
)

cat_model.fit(
    X_train,
    y_train,
    cat_features=cat_features
)

cb_pred = cat_model.predict(X_test)
cb_prob = cat_model.predict_proba(X_test)[:, 1]


# ==========================================
# 9. Evaluation function
# ==========================================

def show_results(name, y_true, pred, prob):

    print(f"\n===== {name} =====")

    print("Accuracy :", round(
        accuracy_score(y_true, pred), 4
    ))

    print("Precision:", round(
        precision_score(y_true, pred), 4
    ))

    print("Recall   :", round(
        recall_score(y_true, pred), 4
    ))

    print("F1 Score :", round(
        f1_score(y_true, pred), 4
    ))

    print("ROC-AUC  :", round(
        roc_auc_score(y_true, prob), 4
    ))


# ==========================================
# 10. Show results
# ==========================================

show_results(
    "LOGISTIC REGRESSION",
    y_test,
    lr_pred,
    lr_prob
)

show_results(
    "RANDOM FOREST",
    y_test,
    rf_pred,
    rf_prob
)

show_results(
    "CATBOOST",
    y_test,
    cb_pred,
    cb_prob
)