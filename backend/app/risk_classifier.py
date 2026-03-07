def classify_risk(score: float) -> str:
    """Standard risk labeling logic."""
    if score >= 62:
        return "Critical"
    elif score >= 38:
        return "High"
    elif score >= 24:
        return "Moderate"
    else:
        return "Low"

def calculate_risk_velocity(current_score: float, previous_score: float = None) -> str:
    """Measures delta in risk intensity."""
    if previous_score is None:
        return "1.0x"
    # Simulated velocity based on score delta
    velocity = 1.0 + (current_score - previous_score) / 100
    return f"{max(0.1, round(velocity, 2))}x"

def project_escalation(score: float) -> str:
    """Projected worsening in the next 6 hours."""
    # Simple deterministic multiplier for demo purposes
    escalation = score * 0.15 if score > 50 else score * 0.05
    return f"+{round(escalation, 1)}%"
