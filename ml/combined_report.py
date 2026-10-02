import json
import pandas as pd


# -----------------------------------------
# Paths
# -----------------------------------------

COST_JSON = "ml/data/processed/project_cost_risk_report_701107.json"
DELAY_JSON = "ml/data/processed/project_delay_risk_report_706718.json"

OUTPUT_JSON = "ml/data/processed/combined_project_risk_report.json"


# -----------------------------------------
# Load reports
# -----------------------------------------

with open(COST_JSON, "r", encoding="utf-8") as f:
    cost_report = json.load(f)

with open(DELAY_JSON, "r", encoding="utf-8") as f:
    delay_report = json.load(f)


# -----------------------------------------
# Note
# -----------------------------------------
# The current cost and delay examples are
# different projects.
#
# For the final dashboard, the backend
# will generate both predictions for the
# SAME project.
#
# This script is only for testing the
# combined JSON structure right now.
# -----------------------------------------


cost_probability = cost_report["risk"]["cost_risk_probability"]
delay_probability = delay_report["risk"]["delay_risk_probability"]


# -----------------------------------------
# Overall risk
# -----------------------------------------

overall_probability = (
    0.5 * cost_probability +
    0.5 * delay_probability
)


if overall_probability >= 0.70:
    overall_level = "HIGH"
elif overall_probability >= 0.40:
    overall_level = "MEDIUM"
else:
    overall_level = "LOW"


# -----------------------------------------
# Combined report
# -----------------------------------------

combined_report = {

    "project": {
        "cost_model_project": cost_report["project"],
        "delay_model_project": delay_report["project"]
    },

    "cost_risk": cost_report["risk"],

    "delay_risk": delay_report["risk"],

    "overall_risk": {
        "probability": round(
            overall_probability,
            4
        ),
        "percentage": round(
            overall_probability * 100,
            2
        ),
        "level": overall_level
    },

    "cost_risk_indicators":
        cost_report["risk_indicators"],

    "delay_risk_indicators":
        delay_report["risk_indicators"],

    "cost_model_features":
        cost_report["top_model_features"],

    "delay_model_features":
        delay_report["top_model_features"],

    "as_of_date":
        cost_report["as_of_date"]
}


# -----------------------------------------
# Save
# -----------------------------------------

with open(
    OUTPUT_JSON,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        combined_report,
        f,
        indent=4
    )


# -----------------------------------------
# Output
# -----------------------------------------

print("\n======================================")
print("      COMBINED PROJECT RISK")
print("======================================")

print(
    f"\nCost Risk: "
    f"{cost_probability * 100:.2f}%"
)

print(
    f"Delay Risk: "
    f"{delay_probability * 100:.2f}%"
)

print(
    f"\nOverall Risk: "
    f"{overall_probability * 100:.2f}%"
)

print(
    f"Overall Risk Level: "
    f"{overall_level}"
)

print("\nCombined JSON saved to:")
print(OUTPUT_JSON)