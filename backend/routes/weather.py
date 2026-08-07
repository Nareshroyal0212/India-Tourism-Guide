# backend/routes/weather.py
from flask import Blueprint, jsonify, request
import requests as req
import os
from dotenv import load_dotenv

load_dotenv()
weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city', 'Delhi')
    api_key = os.getenv("OPENWEATHER_API_KEY")

    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city},IN&appid={api_key}&units=metric"
        response = req.get(url, timeout=10)
        data = response.json()

        if data.get('cod') != 200:
            return jsonify({"success": False, "message": f"City '{city}' not found"}), 404

        return jsonify({
            "success": True,
            "data": {
                "city": data['name'],
                "state": city,
                "temperature": round(data['main']['temp']),
                "feels_like": round(data['main']['feels_like']),
                "humidity": data['main']['humidity'],
                "description": data['weather'][0]['description'].title(),
                "icon": data['weather'][0]['icon'],
                "wind_speed": data['wind']['speed'],
                "visibility": data.get('visibility', 0) // 1000,
                "min_temp": round(data['main']['temp_min']),
                "max_temp": round(data['main']['temp_max'])
            }
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500