# backend/routes/admin.py
from flask import Blueprint, jsonify, request
from functools import wraps
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from db import get_db
from bson import ObjectId
from datetime import datetime, timedelta
import os

admin_bp = Blueprint('admin', __name__)


def require_admin_key(f):
    """JWT-based protection for admin endpoints. Requires a valid token
    issued by /admin/login with role == 'admin'."""
    @wraps(f)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({"success": False, "message": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return wrapper


def _safe_isoformat(value):
    """created_at may be a real datetime (normal case) or, for older/seeded
    records, already a plain string. Handle both without crashing."""
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.isoformat()
    return str(value)


@admin_bp.route('/admin/login', methods=['POST'])
def admin_login():
    """Used by the admin panel login screen. Checks username + password
    against ADMIN_USERNAME and ADMIN_PASSWORD from .env, issues a JWT."""
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '')

    expected_username = os.getenv('ADMIN_USERNAME', '').strip()
    expected_password = os.getenv('ADMIN_PASSWORD', '')

    if not expected_username or not expected_password:
        return jsonify({"success": False, "message": "Admin credentials not configured on server"}), 500

    if username == expected_username and password == expected_password:
        token = create_access_token(
            identity=username,
            additional_claims={"role": "admin"},
            expires_delta=timedelta(hours=8)
        )
        return jsonify({
            "success": True,
            "token": token,
            "user": {"username": username, "role": "admin"}
        })

    return jsonify({"success": False, "message": "Incorrect username or password"}), 401


@admin_bp.route('/admin/feedback', methods=['GET'])
@require_admin_key
def admin_feedback():
    db = get_db()
    feedback_collection = db["feedback"]

    entries = []
    star_counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}

    for item in feedback_collection.find().sort("created_at", -1):
        rating = item.get("rating", 0)
        if rating in star_counts:
            star_counts[rating] += 1
        entries.append({
            "id": str(item["_id"]),
            "name": item.get("name", "Anonymous"),
            "email": item.get("email", ""),
            "rating": rating,
            "comment": item.get("comment", ""),
            "created_at": _safe_isoformat(item.get("created_at"))
        })

    total = len(entries)
    average = round(sum(r * c for r, c in star_counts.items()) / total, 2) if total > 0 else 0

    return jsonify({
        "success": True,
        "total": total,
        "average_rating": average,
        "star_counts": star_counts,
        "data": entries
    })


@admin_bp.route('/admin/users', methods=['GET'])
@require_admin_key
def admin_users():
    db = get_db()
    users_collection = db["users"]
    visited_collection = db["visited"]

    users = []
    for item in users_collection.find().sort("_id", -1):
        user_id = item["_id"]

        try:
            visited_count = visited_collection.count_documents({"user_id": str(user_id)})
        except Exception:
            visited_count = 0

        users.append({
            "id": str(user_id),
            "full_name": item.get("full_name", "Unknown"),
            "phone": item.get("phone", ""),
            "email": item.get("email", ""),
            "govt_id_type": item.get("govt_id_type", ""),
            "govt_id": item.get("govt_id", ""),
            "created_at": _safe_isoformat(item.get("created_at")),
            "visited_count": visited_count
        })

    return jsonify({"success": True, "total": len(users), "data": users})


@admin_bp.route('/admin/users/<user_id>/visited', methods=['GET'])
@require_admin_key
def admin_user_visited(user_id):
    db = get_db()
    visited_collection = db["visited"]

    places = []
    try:
        for item in visited_collection.find({"user_id": user_id}).sort("visited_at", -1):
            places.append({
                "id": str(item["_id"]),
                "place_name": item.get("place_name", "Unknown place"),
                "visited_at": _safe_isoformat(item.get("visited_at"))
            })
    except Exception as e:
        return jsonify({"success": False, "message": str(e), "places": []}), 500

    return jsonify({"success": True, "places": places})


@admin_bp.route('/admin/photos', methods=['GET'])
@require_admin_key
def admin_photos():
    db = get_db()
    photos_collection = db["photos"]

    photos = []
    for item in photos_collection.find().sort("uploaded_at", -1):
        photos.append({
            "id": str(item["_id"]),
            "place_id": item.get("place_id"),
            "url": item.get("url"),
            "uploaded_by": item.get("uploaded_by", "Anonymous"),
            "uploaded_at": _safe_isoformat(item.get("uploaded_at"))
        })

    return jsonify({"success": True, "total": len(photos), "photos": photos})


@admin_bp.route('/admin/photos/<photo_id>', methods=['DELETE'])
@require_admin_key
def admin_delete_photo(photo_id):
    import os as _os
    db = get_db()
    photos_collection = db["photos"]

    try:
        photo = photos_collection.find_one({"_id": ObjectId(photo_id)})
    except Exception:
        return jsonify({"success": False, "message": "Invalid photo ID"}), 400

    if not photo:
        return jsonify({"success": False, "message": "Photo not found"}), 404

    upload_folder = _os.path.join(
        _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))),
        'static', 'uploads'
    )
    filepath = _os.path.join(upload_folder, _os.path.basename(photo["url"]))
    if _os.path.exists(filepath):
        _os.remove(filepath)

    photos_collection.delete_one({"_id": ObjectId(photo_id)})
    return jsonify({"success": True, "message": "Photo removed"})


@admin_bp.route('/admin/places', methods=['POST'])
@require_admin_key
def admin_add_place():
    """Used by the Add Place tab in the admin dashboard.
    Saves a new tourist place directly to the places collection."""
    data = request.get_json() or {}

    name = data.get('name', '').strip()
    city = data.get('city', '').strip()
    state = data.get('state', '').strip()

    if not name or not city or not state:
        return jsonify({"success": False, "message": "Name, city and state are required!"}), 400

    def _to_float(value, default=0.0):
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    place_doc = {
        "name": name,
        "city": city,
        "state": state,
        "category": data.get('category', 'Historical'),
        "description": data.get('description', ''),
        "rating": _to_float(data.get('rating'), 4.5),
        "entry_fee": _to_float(data.get('entry_fee'), 0),
        "best_time": data.get('best_time', ''),
        "duration": data.get('duration', ''),
        "image": data.get('image', ''),
        "lat": _to_float(data.get('lat'), None) if data.get('lat') not in (None, '') else None,
        "lng": _to_float(data.get('lng'), None) if data.get('lng') not in (None, '') else None,
        "tags": data.get('tags', []) if isinstance(data.get('tags'), list) else [],
        "created_at": datetime.utcnow()
    }

    db = get_db()
    places_collection = db["places"]
    result = places_collection.insert_one(place_doc)

    return jsonify({
        "success": True,
        "message": f"'{name}' added successfully!",
        "id": str(result.inserted_id)
    })