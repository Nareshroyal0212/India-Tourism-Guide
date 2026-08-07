# backend/routes/visited.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db
from datetime import datetime

visited_bp = Blueprint('visited', __name__)


@visited_bp.route('/visited', methods=['GET'])
@jwt_required()
def get_visited():
    """Returns the logged-in user's visited places and total count.
    Used by the Travel Badges page and My Visited page."""
    user_id = get_jwt_identity()
    db = get_db()
    visited_collection = db["visited"]

    places = []
    for item in visited_collection.find({"user_id": user_id}).sort("visited_at", -1):
        places.append({
            "id": str(item["_id"]),
            "place_id": item.get("place_id"),
            "place_name": item.get("place_name", "Unknown place"),
            "visited_at": item.get("visited_at").isoformat() if item.get("visited_at") else None
        })

    return jsonify({
        "success": True,
        "total": len(places),
        "places": places
    })


@visited_bp.route('/visited', methods=['POST'])
@jwt_required()
def mark_visited():
    """Marks a place as visited for the logged-in user.
    Expects JSON body: { "place_id": "...", "place_name": "..." }"""
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    place_id = data.get('place_id')
    place_name = data.get('place_name', 'Unknown place')

    if not place_id:
        return jsonify({"success": False, "message": "place_id is required"}), 400

    db = get_db()
    visited_collection = db["visited"]

    # Avoid duplicate entries if the user marks the same place twice
    existing = visited_collection.find_one({"user_id": user_id, "place_id": place_id})
    if existing:
        return jsonify({"success": True, "message": "Already marked as visited"})

    visited_collection.insert_one({
        "user_id": user_id,
        "place_id": place_id,
        "place_name": place_name,
        "visited_at": datetime.now()
    })

    total = visited_collection.count_documents({"user_id": user_id})

    return jsonify({
        "success": True,
        "message": f"'{place_name}' marked as visited!",
        "total": total
    }), 201


@visited_bp.route('/visited/<place_id>', methods=['DELETE'])
@jwt_required()
def unmark_visited(place_id):
    """Removes a place from the user's visited list (undo)."""
    user_id = get_jwt_identity()
    db = get_db()
    visited_collection = db["visited"]

    result = visited_collection.delete_one({"user_id": user_id, "place_id": place_id})

    if result.deleted_count == 0:
        return jsonify({"success": False, "message": "Place not found in visited list"}), 404

    total = visited_collection.count_documents({"user_id": user_id})
    return jsonify({"success": True, "message": "Removed from visited places", "total": total})