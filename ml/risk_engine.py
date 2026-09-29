def get_risk_level(probability):
    if probability >= 0.70:
        return "HIGH"
    elif probability >= 0.40:
        return "MEDIUM"
    else:
        return "LOW"


def calculate_cost_risk(cost_probability):
    return {
        "cost_risk_probability": round(float(cost_probability), 4),
        "cost_risk_percent": round(float(cost_probability) * 100, 2),
        "risk_level": get_risk_level(cost_probability)
    }