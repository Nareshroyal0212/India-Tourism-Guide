# backend/routes/places.py
from flask import Blueprint, jsonify, request
from db import get_db

places_bp = Blueprint('places', __name__)

@places_bp.route('/places', methods=['GET'])
def get_all_places():
    try:
        db = get_db()
        places = list(db.places.find({}, {'_id': 0}))
        return jsonify({"success": True, "data": places})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@places_bp.route('/places/search', methods=['GET'])
def search_places():
    query = request.args.get('q', '')
    try:
        db = get_db()
        places = list(db.places.find(
            {"$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"city": {"$regex": query, "$options": "i"}},
                {"state": {"$regex": query, "$options": "i"}},
                {"category": {"$regex": query, "$options": "i"}}
            ]}, {'_id': 0}
        ))
        return jsonify({"success": True, "data": places})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@places_bp.route('/places/state/<state>', methods=['GET'])
def get_by_state(state):
    try:
        db = get_db()
        places = list(db.places.find(
            {"state": {"$regex": state, "$options": "i"}},
            {'_id': 0}
        ))
        return jsonify({"success": True, "data": places})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@places_bp.route('/places/category/<category>', methods=['GET'])
def get_by_category(category):
    try:
        db = get_db()
        places = list(db.places.find(
            {"category": {"$regex": category, "$options": "i"}},
            {'_id': 0}
        ))
        return jsonify({"success": True, "data": places})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500