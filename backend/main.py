from pathlib import Path

import pandas as pd
from catboost import CatBoostClassifier
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ml.feature_engineering import prepare_features
from ml.risk_engine import get_risk_level


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="PAIMANA AI Risk API",
    description="AI-powered infrastructure project risk API",
    version="1.0.0",
)


# =========================================================
# CORS
# Allows React frontend to call this API later
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_PATH = (
    BASE_DIR
    / "ml"
    / "data"
    / "processed"
    / "paimana_cleaned.csv"
)

COST_MODEL_PATH = (
    BASE_DIR
    / "models"
    / "cost_catboost.cbm"
)

DELAY_MODEL_PATH = (
    BASE_DIR
    / "models"
    / "delay_catboost.cbm"
)


# =========================================================
# LOAD DATA
# =========================================================

df = pd.read_csv(DATA_PATH)

df["project_code"] = (
    df["project_code"]
    .astype(str)
    .str.strip()
)


# =========================================================
# LOAD MODELS
# =========================================================

cost_model = CatBoostClassifier()
cost_model.load_model(str(COST_MODEL_PATH))

delay_model = CatBoostClassifier()
delay_model.load_model(str(DELAY_MODEL_PATH))


# =========================================================
# FEATURES
# =========================================================

FEATURES = [
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


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "message": "PAIMANA AI Risk API is running",
        "status": "ok",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "projects_loaded": len(df),
        "cost_model": "loaded",
        "delay_model": "loaded",
    }


# =========================================================
# PROJECT RISK
# =========================================================

@app.get("/project/{project_code}")
def get_project_risk(project_code: str):

    project_code = str(project_code).strip()

    # Find project
    project = df[
        df["project_code"] == project_code
    ].copy()

    if project.empty:

        raise HTTPException(
            status_code=404,
            detail=f"Project {project_code} not found",
        )


    # Prepare features
    try:

        project_features = prepare_features(
            project
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Feature preparation failed: {str(e)}",
        )


    if project_features.empty:

        raise HTTPException(
            status_code=400,
            detail=(
                "Project does not have enough valid "
                "data for prediction."
            ),
        )


    # Input for both models
    X = project_features[FEATURES]


    # -----------------------------------------------------
    # COST RISK
    # -----------------------------------------------------

    cost_probability = (
        cost_model
        .predict_proba(X)[0][1]
    )


    # -----------------------------------------------------
    # DELAY RISK
    # -----------------------------------------------------

    delay_probability = (
        delay_model
        .predict_proba(X)[0][1]
    )


    # -----------------------------------------------------
    # OVERALL RISK
    # -----------------------------------------------------

    overall_probability = (
        0.5 * cost_probability
        + 0.5 * delay_probability
    )


    # Project row
    p = project_features.iloc[0]


    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {

        "project": {
            "project_code": str(
                p["project_code"]
            ),
            "project_name": p["project_name"],
            "sector": p["sector"],
            "ministry": p["ministry"],
            "agency": p["agency"],
        },

        "indicators": {
            "original_cost": float(
                p["original_cost"]
            ),
            "expenditure": float(
                p["expenditure"]
            ),
            "physical_progress": float(
                p["physical_progress"]
            ),
            "expenditure_ratio": float(
                p["expenditure_ratio"]
            ),
            "project_age_days": int(
                p["project_age_days"]
            ),
            "time_remaining_days": int(
                p["time_remaining_days"]
            ),
        },

        "cost_risk": {
            "probability": round(
                float(cost_probability),
                4,
            ),
            "percentage": round(
                float(cost_probability) * 100,
                2,
            ),
            "risk_level": get_risk_level(
                cost_probability
            ),
        },

        "delay_risk": {
            "probability": round(
                float(delay_probability),
                4,
            ),
            "percentage": round(
                float(delay_probability) * 100,
                2,
            ),
            "risk_level": get_risk_level(
                delay_probability
            ),
        },

        "overall_risk": {
            "probability": round(
                float(overall_probability),
                4,
            ),
            "percentage": round(
                float(overall_probability) * 100,
                2,
            ),
            "risk_level": get_risk_level(
                overall_probability
            ),
        },

        "as_of_date": "2026-08-31",
    }

@app.get("/projects")
def get_projects():

    projects = []

    for _, row in df.iterrows():

        projects.append({
            "projectCode": str(row["project_code"]),
            "projectName": row["project_name"],
            "sector": row["sector"],
            "ministry": row["ministry"],
            "implementingAgency": row["agency"],
            "state": "Not available",

            "originalCost": float(row["original_cost"]),
            "revisedCost": float(row["revised_cost"]),
            "expenditure": float(row["expenditure"]),
            "physicalProgress": float(
                row["physical_progress"]
            ),

            "sanctionDate": str(row["sanction_date"]),
            "originalCommissioningDate": str(
                row["original_completion"]
            ),

            "revisedCommissioningDate": (
                str(row["revised_completion"])
                if pd.notna(row["revised_completion"])
                else ""
            ),
        })

    return {
        "total_projects": len(projects),
        "projects": projects,
    }

@app.get("/risk")
def get_all_project_risks():

    project_features = prepare_features(
        df.copy()
    )

    X = project_features[FEATURES]

    cost_probabilities = (
        cost_model.predict_proba(X)[:, 1]
    )

    delay_probabilities = (
        delay_model.predict_proba(X)[:, 1]
    )

    results = []

    for i, (_, row) in enumerate(
        project_features.iterrows()
    ):

        cost_probability = float(
            cost_probabilities[i]
        )

        delay_probability = float(
            delay_probabilities[i]
        )

        overall_probability = (
            0.5 * cost_probability
            + 0.5 * delay_probability
        )

        results.append({

            "projectCode": str(
                row["project_code"]
            ),

            "delayRiskScore": round(
                delay_probability * 100,
                2
            ),

            "costRiskScore": round(
                cost_probability * 100,
                2
            ),

            "overallRiskScore": round(
                overall_probability * 100,
                2
            ),

            "delayRiskLevel":
                get_risk_level(
                    delay_probability
                ).title(),

            "costRiskLevel":
                get_risk_level(
                    cost_probability
                ).title(),

            "overallRiskLevel":
                get_risk_level(
                    overall_probability
                ).title(),

            "predictionDate": "2026-08-31"
        })

    return {
        "total_projects": len(results),
        "risks": results
    }