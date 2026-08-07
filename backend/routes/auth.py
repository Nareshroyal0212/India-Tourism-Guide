# backend/routes/auth.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db
from datetime import datetime, timedelta
import secrets
import os

auth_bp = Blueprint('auth', __name__)


def send_welcome_email(to_email, full_name):
    """Best-effort welcome email. If mail isn't configured or fails,
    registration still succeeds — this never blocks account creation."""
    try:
        from flask_mail import Message
        mail = current_app.extensions.get('mail')
        if not mail:
            return
        msg = Message(
            subject="Welcome to India Tourism Guide!",
            recipients=[to_email],
            body=f"Namaste {full_name}! 🙏\n\nYour account has been created successfully. "
                 f"Start exploring India's 28 states with our AI-powered guide!\n\n"
                 f"Happy travels!"
        )
        mail.send(msg)
    except Exception:
        pass  # Email is a nice-to-have, never fail registration because of it


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "No data provided"}), 400

    full_name = (data.get('full_name') or '').strip()
    phone = (data.get('phone') or '').strip()
    email = (data.get('email') or '').strip().lower()
    govt_id_type = data.get('govt_id_type', 'Aadhaar')
    govt_id = (data.get('govt_id') or '').strip()
    password = data.get('password') or ''

    # Server-side validation (mirrors the frontend checks, since the
    # frontend can always be bypassed)
    if not full_name:
        return jsonify({"success": False, "message": "Full name is required"}), 400
    if not phone or len(phone) != 10 or not phone.isdigit():
        return jsonify({"success": False, "message": "Enter a valid 10-digit phone number"}), 400
    if '@' not in email:
        return jsonify({"success": False, "message": "Enter a valid email address"}), 400
    if not govt_id:
        return jsonify({"success": False, "message": "Government ID number is required"}), 400
    if len(password) < 6:
        return jsonify({"success": False, "message": "Password must be at least 6 characters"}), 400

    db = get_db()
    users_collection = db["users"]

    if users_collection.find_one({"email": email}):
        return jsonify({"success": False, "message": "An account with this email already exists"}), 409
    if users_collection.find_one({"phone": phone}):
        return jsonify({"success": False, "message": "An account with this phone number already exists"}), 409

    password_hash = generate_password_hash(password)

    result = users_collection.insert_one({
        "full_name": full_name,
        "phone": phone,
        "email": email,
        "govt_id_type": govt_id_type,
        "govt_id": govt_id,
        "password_hash": password_hash,
        "created_at": datetime.now()
    })

    user_id = str(result.inserted_id)
    token = create_access_token(identity=user_id)

    send_welcome_email(email, full_name)

    return jsonify({
        "success": True,
        "token": token,
        "user": {
            "id": user_id,
            "full_name": full_name,
            "email": email,
            "phone": phone
        }
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "No data provided"}), 400

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if '@' not in email or not password:
        return jsonify({"success": False, "message": "Enter a valid email and password"}), 400

    db = get_db()
    users_collection = db["users"]
    user = users_collection.find_one({"email": email})

    if not user or not check_password_hash(user.get("password_hash", ""), password):
        return jsonify({"success": False, "message": "Incorrect email or password"}), 401

    user_id = str(user["_id"])
    token = create_access_token(identity=user_id)

    return jsonify({
        "success": True,
        "token": token,
        "user": {
            "id": user_id,
            "full_name": user.get("full_name", ""),
            "email": user.get("email", ""),
            "phone": user.get("phone", "")
        }
    })


def send_reset_email(to_email, full_name, reset_link):
    """Best-effort email with the password reset link."""
    try:
        from flask_mail import Message
        mail = current_app.extensions.get('mail')
        if not mail:
            return False
        msg = Message(
            subject="Reset your India Tourism Guide password",
            recipients=[to_email],
            body=f"Namaste {full_name}! 🙏\n\n"
                 f"We received a request to reset your password. Click the link below "
                 f"to choose a new one. This link expires in 1 hour:\n\n{reset_link}\n\n"
                 f"If you didn't request this, you can safely ignore this email."
        )
        mail.send(msg)
        return True
    except Exception:
        return False


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    if not data or 'email' not in data:
        return jsonify({"success": False, "message": "Email is required"}), 400

    email = data['email'].strip().lower()
    db = get_db()
    users_collection = db["users"]
    user = users_collection.find_one({"email": email})

    # Always return success, even if the email isn't registered — this
    # prevents attackers from using this endpoint to discover which
    # emails have accounts on the site.
    if not user:
        return jsonify({"success": True, "message": "If that email is registered, a reset link has been sent."})

    reset_token = secrets.token_urlsafe(32)
    expiry = datetime.now() + timedelta(hours=1)

    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"reset_token": reset_token, "reset_token_expiry": expiry}}
    )

    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    reset_link = f"{frontend_url}/reset-password/{reset_token}"

    send_reset_email(email, user.get("full_name", "there"), reset_link)

    return jsonify({"success": True, "message": "If that email is registered, a reset link has been sent."})


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    if not data or 'token' not in data or 'password' not in data:
        return jsonify({"success": False, "message": "Token and new password are required"}), 400

    token = data['token']
    new_password = data['password']

    if len(new_password) < 6:
        return jsonify({"success": False, "message": "Password must be at least 6 characters"}), 400

    db = get_db()
    users_collection = db["users"]
    user = users_collection.find_one({"reset_token": token})

    if not user:
        return jsonify({"success": False, "message": "Invalid or expired reset link"}), 400

    expiry = user.get("reset_token_expiry")
    if not expiry or datetime.now() > expiry:
        return jsonify({"success": False, "message": "This reset link has expired. Please request a new one."}), 400

    users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"password_hash": generate_password_hash(new_password)},
            "$unset": {"reset_token": "", "reset_token_expiry": ""}
        }
    )

    return jsonify({"success": True, "message": "Password reset successfully. You can now log in."})