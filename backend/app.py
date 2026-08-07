# backend/app.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from dotenv import load_dotenv
from routes.feedback import feedback_bp
from datetime import timedelta
import os

load_dotenv()

app = Flask(__name__)

# CORS: restrict to your actual frontend domain(s) once deployed.
# Keep localhost for local development, add your Vercel URL after
# you deploy the frontend (Part 3 of deployment).
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", "")  # set this env var on Render once you have your Vercel URL
]}})

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'fallback_secret')
# Without this, Flask-JWT-Extended defaults to a 15-minute token lifetime,
# which was silently logging users out mid-session. 7 days is reasonable
# for a travel app users dip in and out of.
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
jwt = JWTManager(app)
app.register_blueprint(feedback_bp, url_prefix='/api')
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_EMAIL')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_EMAIL')
mail = Mail(app)

from routes.places import places_bp
from routes.chatbot import chatbot_bp
from routes.budget import budget_bp
from routes.weather import weather_bp
from routes.recommend import recommend_bp
from routes.auth import auth_bp
from routes.photos import photos_bp
from routes.admin import admin_bp
from routes.recognize import recognize_bp
from routes.visited import visited_bp

app.register_blueprint(places_bp, url_prefix='/api')
app.register_blueprint(chatbot_bp, url_prefix='/api')
app.register_blueprint(budget_bp, url_prefix='/api')
app.register_blueprint(weather_bp, url_prefix='/api')
app.register_blueprint(recommend_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(photos_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')
app.register_blueprint(recognize_bp, url_prefix='/api')
app.register_blueprint(visited_bp, url_prefix='/api')

@app.route('/api/test')
def test():
    return {"message": "India Tourism Backend running!"}

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.getenv('FLASK_ENV') == 'development'
    app.run(debug=debug_mode, host='0.0.0.0', port=port, use_reloader=False)