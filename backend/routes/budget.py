# backend/routes/budget.py
from flask import Blueprint, jsonify, request

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('/budget', methods=['POST'])
def predict_budget():
    data = request.get_json()
    days = int(data.get('days', 1))
    people = int(data.get('people', 1))
    travel_type = data.get('travel_type', 'mid')
    places = data.get('places', [])
    transport = data.get('transport', 'train')

    base_costs = {'budget': 1200, 'mid': 3500, 'luxury': 8000}
    transport_costs = {'flight': 5000, 'train': 800, 'bus': 400, 'car': 2000}

    base = base_costs.get(travel_type, 3500)
    travel_cost = transport_costs.get(transport, 800) * people
    place_cost = len(places) * 300

    total = (base * people * days) + travel_cost + place_cost

    accommodation = round(base * 0.40 * people * days)
    food = round(base * 0.25 * people * days)
    local_transport = round(base * 0.15 * people * days)
    activities = round((base * 0.10 * people * days) + place_cost)
    intercity_travel = round(travel_cost)
    miscellaneous = round(base * 0.10 * people * days)

    return jsonify({
        "success": True,
        "total_estimate": round(total),
        "breakdown": {
            "accommodation": accommodation,
            "food": food,
            "local_transport": local_transport,
            "activities": activities,
            "intercity_travel": intercity_travel,
            "miscellaneous": miscellaneous
        },
        "per_person": round(total / people),
        "per_day": round(total / days),
        "tip": f"For a {travel_type} trip of {days} days with {people} people, estimated budget is ₹{round(total):,}"
    })