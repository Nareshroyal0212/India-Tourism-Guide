<div align="center">

# 🇮🇳 India Tourism Guide

### Your AI-powered companion for exploring Incredible India

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Flask-Python-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](#-license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](#-contributing)
[![Made with ❤️ in India](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F%20in%20India-orange?style=flat-square)](#)

</div>

---

## ✨ Overview

**India Tourism Guide** is a full-stack travel companion app that helps travelers **discover, plan, and explore India** — powered by AI. Upload a photo and let AI identify the landmark, chat with an AI travel assistant, get real-time weather, plan budgets, track visited places, and much more.

<div align="center">

| 🏛️ Explore Places | 🤖 AI Photo Recognition | 💬 AI Chat Assistant | 🌦️ Live Weather |
|:---:|:---:|:---:|:---:|
| 💰 Budget Planner | 📍 Nearby & Distance | 🎉 Festivals & Events | 🛣️ Toll Plazas & Fuel Stops |

</div>

---

## 🚀 Features

- 📸 **AI Photo Recognition** — Upload a photo of a place and let AI (CLIP-based zero-shot classification) identify the landmark
- 💬 **AI ChatBot** — Ask travel questions and get instant, intelligent answers
- 🗺️ **Explore India** — Browse curated destinations, restaurants, and hidden gems
- 🌤️ **Live Weather** — Real-time weather updates for any destination (OpenWeather API)
- 💰 **Budget Planner** — Estimate and plan your trip expenses
- ✅ **My Visited Places** — Track and log the places you've explored
- 👥 **Group Trip Planning** — Plan trips together with friends and family
- 📍 **Nearby & Distance Finder** — Find nearby attractions and calculate distances
- ⛽ **Fuel Stations & 🛣️ Toll Plazas** — Handy info for road trippers
- 🎉 **Festivals Calendar** — Discover festivals happening across India
- 🏅 **Badges & Achievements** — Gamified rewards for explorers
- 🌐 **Multi-language Support** — Switch between languages seamlessly
- 🔐 **Secure Auth** — JWT-based login, registration, and password recovery
- 🛠️ **Admin Dashboard** — Manage users, feedback, and places from a dedicated admin panel

---

## 🧰 Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

### AI / ML
![Hugging Face](https://img.shields.io/badge/🤗%20Transformers-FFD21E?style=for-the-badge)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)

</div>

---

## 📁 Project Structure

```
India-Tourism-Guide/
├── backend/
│   ├── routes/              # Flask blueprints (auth, admin, weather, recognize, etc.)
│   ├── app.py                # Flask app entry point
│   ├── db.py                  # MongoDB connection
│   ├── seed_data.py          # Seed script for initial data
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment variable template
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, etc.)
│   │   ├── context/          # Language & Theme context providers
│   │   ├── data/             # Static data (festivals, fuel stations, etc.)
│   │   └── pages/            # App pages (Home, Weather, AdminPanel, etc.)
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started

### ✅ Prerequisites


- [Python](https://www.python.org/) (v3.10+)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Nareshroyal0212/India-Tourism-Guide.git
cd India-Tourism-Guide
```

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv

# Activate virtual environment
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

Create your own `.env` file from the template:

```bash
cp .env.example .env
```

Then fill in your real values inside `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweather_api_key
SECRET_KEY=your_flask_secret_key
JWT_SECRET=your_jwt_secret
FLASK_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password
MAIL_EMAIL=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=your_admin_email
```

> ⚠️ **Never commit your real `.env` file.** It's already excluded via `.gitignore`.

Run the backend:

```bash
python app.py
```

The API will be live at **`http://localhost:5000`**

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app will be live at **`http://localhost:3000`**

---

## 🖼️ Screenshots

<div align="center">



| Home | AI Photo Recognition | Admin Dashboard |
|:---:|:---:|:---:|
|  _screenshot_ | _screenshot_ | _screenshot_ |

</div>

---

## 🔐 Security Notes

- All secrets live in `backend/.env`, which is **git-ignored** and never pushed to GitHub
- `backend/.env.example` is provided as a safe template for setup
- JWT tokens are used for authenticated routes with a 7-day expiry
- Passwords and admin credentials should always be changed from the defaults before deployment

---

## 🤝 Contributing

Contributions are welcome! 🎉

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

<div align="center">

### 🌟 If you like this project, give it a star!

Made with ❤️ for travelers exploring **Incredible India** 🇮🇳

</div>
