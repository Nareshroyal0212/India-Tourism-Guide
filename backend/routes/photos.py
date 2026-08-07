# backend/routes/photos.py
from flask import Blueprint, request, jsonify
from db import get_db
from datetime import datetime
from bson import ObjectId
import os
import uuid

photos_bp = Blueprint('photos', __name__)

# Files are saved to backend/static/uploads/, which Flask serves
# automatically at /static/uploads/<filename> since 'static' is the
# default static folder relative to app.py's location.
UPLOAD_FOLDER = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    'static', 'uploads'
)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@photos_bp.route('/photos/<place_id>', methods=['GET'])
def get_photos(place_id):
    db = get_db()
    photos_collection = db["photos"]

    photos = []
    for item in photos_collection.find({"place_id": place_id}).sort("uploaded_at", -1):
        photos.append({
            "id": str(item["_id"]),
            "url": item["url"],
            "uploaded_by": item.get("uploaded_by", "Anonymous"),
            "caption": item.get("caption", ""),
            "uploaded_at": item["uploaded_at"].isoformat() if item.get("uploaded_at") else None
        })

    return jsonify({"success": True, "photos": photos})


@photos_bp.route('/photos', methods=['POST'])
def upload_photo():
    if 'photo' not in request.files:
        return jsonify({"success": False, "message": "No photo file provided"}), 400

    file = request.files['photo']
    place_id = request.form.get('place_id')
    uploaded_by = request.form.get('uploaded_by', 'Anonymous')
    caption = request.form.get('caption', '')

    if not place_id:
        return jsonify({"success": False, "message": "place_id is required"}), 400

    if file.filename == '':
        return jsonify({"success": False, "message": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({
            "success": False,
            "message": "Invalid file type. Allowed: png, jpg, jpeg, gif, webp"
        }), 400

    # Check file size without loading the whole thing into memory twice
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    if size > MAX_FILE_SIZE:
        return jsonify({"success": False, "message": "File too large. Max 5MB"}), 400

    ext = file.filename.rsplit('.', 1)[1].lower()
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, unique_name)
    file.save(filepath)

    photo_url = f"/static/uploads/{unique_name}"

    db = get_db()
    photos_collection = db["photos"]
    result = photos_collection.insert_one({
        "place_id": place_id,
        "url": photo_url,
        "uploaded_by": uploaded_by,
        "caption": caption,
        "uploaded_at": datetime.now()
    })

    return jsonify({
        "success": True,
        "photo": {
            "id": str(result.inserted_id),
            "url": photo_url,
            "uploaded_by": uploaded_by,
            "caption": caption
        }
    }), 201


@photos_bp.route('/photos/<photo_id>', methods=['DELETE'])
def delete_photo(photo_id):
    db = get_db()
    photos_collection = db["photos"]

    try:
        photo = photos_collection.find_one({"_id": ObjectId(photo_id)})
    except Exception:
        return jsonify({"success": False, "message": "Invalid photo ID"}), 400

    if not photo:
        return jsonify({"success": False, "message": "Photo not found"}), 404

    filepath = os.path.join(UPLOAD_FOLDER, os.path.basename(photo["url"]))
    if os.path.exists(filepath):
        os.remove(filepath)

    photos_collection.delete_one({"_id": ObjectId(photo_id)})
    return jsonify({"success": True, "message": "Photo deleted"})