from flask import Blueprint, request, jsonify
from db import get_db
from datetime import datetime

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/feedback', methods=['POST'])
def save_feedback():
    try:
        data = request.get_json()

        db = get_db()
        feedback_collection = db["feedback"]

        feedback_collection.insert_one({
            "name": data.get("name"),
            "email": data.get("email"),
            "rating": data.get("rating"),
            "comment": data.get("comment"),
            "created_at": datetime.now()
        })

        return jsonify({
            "success": True,
            "message": "Feedback saved successfully"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@feedback_bp.route('/feedbacks', methods=['GET'])
def get_feedbacks():

    db = get_db()
    feedback_collection = db["feedback"]

    feedbacks = []

    for item in feedback_collection.find():
        feedbacks.append({
            "name": item.get("name"),
            "email": item.get("email"),
            "rating": item.get("rating"),
            "comment": item.get("comment")
        })

    return jsonify(feedbacks)