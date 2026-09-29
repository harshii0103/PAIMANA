def calculate_overall_risk(cost_probability, delay_probability):
    """
    Combine cost and delay probabilities into
    one overall project risk score.
    """

    cost_probability = float(cost_probability)
    delay_probability = float(delay_probability)

    # Equal weighting
    overall_probability = (
        0.5 * cost_probability +
        0.5 * delay_probability
    )

    if overall_probability >= 0.70:
        risk_level = "HIGH"
    elif overall_probability >= 0.40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "overall_risk_probability": round(
            overall_probability, 4
        ),
        "overall_risk_percent": round(
            overall_probability * 100, 2
        ),
        "overall_risk_level": risk_level,
        "cost_risk_percent": round(
            cost_probability * 100, 2
        ),
        "delay_risk_percent": round(
            delay_probability * 100, 2
        )
    }


if __name__ == "__main__":

    # Example using your two current test results
    cost_probability = 0.9297
    delay_probability = 0.9969

    result = calculate_overall_risk(
        cost_probability,
        delay_probability
    )

    print("\n======================================")
    print("       OVERALL PROJECT RISK")
    print("======================================")

    print(
        f"\nCost Risk: "
        f"{result['cost_risk_percent']}%"
    )

    print(
        f"Delay Risk: "
        f"{result['delay_risk_percent']}%"
    )

    print(
        f"\nOverall Risk: "
        f"{result['overall_risk_percent']}%"
    )

    print(
        f"Overall Risk Level: "
        f"{result['overall_risk_level']}"
    )