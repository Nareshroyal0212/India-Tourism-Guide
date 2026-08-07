# backend/routes/recommend.py
from flask import Blueprint, jsonify, request

recommend_bp = Blueprint('recommend', __name__)

PLACES = [
    {"name": "Taj Mahal", "city": "Agra", "state": "Uttar Pradesh", "category": "Historical", "tags": ["heritage", "history", "romantic", "architecture"], "rating": 4.9, "entry_fee": 50, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/640px-Taj_Mahal_%28Edited%29.jpeg"},
    {"name": "Goa Beaches", "city": "Panaji", "state": "Goa", "category": "Beach", "tags": ["beach", "nightlife", "water sports", "relaxation"], "rating": 4.6, "entry_fee": 0, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Baga_beach_Goa.jpg/640px-Baga_beach_Goa.jpg"},
    {"name": "Alleppey Backwaters", "city": "Alleppey", "state": "Kerala", "category": "Nature", "tags": ["backwaters", "houseboat", "nature", "scenic", "relaxation"], "rating": 4.8, "entry_fee": 0, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Alappuzha_backwaters.jpg/640px-Alappuzha_backwaters.jpg"},
    {"name": "Amber Fort", "city": "Jaipur", "state": "Rajasthan", "category": "Historical", "tags": ["heritage", "fort", "history", "architecture", "photography"], "rating": 4.7, "entry_fee": 100, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Amer_Fort%2C_Jaipur%2C_Rajasthan%2C_India.jpg/640px-Amer_Fort%2C_Jaipur%2C_Rajasthan%2C_India.jpg"},
    {"name": "Munnar Hill Station", "city": "Munnar", "state": "Kerala", "category": "Hill Station", "tags": ["hill station", "tea", "trekking", "nature", "scenic"], "rating": 4.7, "entry_fee": 0, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Munnar%2C_Kerala.jpg/640px-Munnar%2C_Kerala.jpg"},
    {"name": "Kaziranga National Park", "city": "Golaghat", "state": "Assam", "category": "Wildlife", "tags": ["wildlife", "rhino", "safari", "nature", "national park"], "rating": 4.9, "entry_fee": 500, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kaziranga_Rhino.jpg/640px-Kaziranga_Rhino.jpg"},
    {"name": "Golden Temple", "city": "Amritsar", "state": "Punjab", "category": "Temple", "tags": ["spiritual", "pilgrimage", "Sikh", "famous", "peaceful"], "rating": 4.9, "entry_fee": 0, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Golden_Temple%2C_Amritsar%2C_India_-_Aug_2012.jpg/640px-Golden_Temple%2C_Amritsar%2C_India_-_Aug_2012.jpg"},
    {"name": "Spiti Valley", "city": "Kaza", "state": "Himachal Pradesh", "category": "Adventure", "tags": ["adventure", "trekking", "mountain", "monastery", "offbeat"], "rating": 4.9, "entry_fee": 0, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Spiti_Valley_Himachal_Pradesh.jpg/640px-Spiti_Valley_Himachal_Pradesh.jpg"},
    {"name": "Hampi Ruins", "city": "Hampi", "state": "Karnataka", "category": "Historical", "tags": ["UNESCO", "ruins", "history", "photography", "heritage"], "rating": 4.8, "entry_fee": 30, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Hampi1.jpg/640px-Hampi1.jpg"},
    {"name": "Rishikesh", "city": "Rishikesh", "state": "Uttarakhand", "category": "Adventure", "tags": ["rafting", "yoga", "spiritual", "adventure", "trekking"], "rating": 4.7, "entry_fee": 0, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Rishikesh.jpg/640px-Rishikesh.jpg"},
    {"name": "Valley of Flowers", "city": "Chamoli", "state": "Uttarakhand", "category": "National Park", "tags": ["trekking", "flowers", "nature", "UNESCO", "national park"], "rating": 4.9, "entry_fee": 150, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Valley_of_flowers_trek.jpg/640px-Valley_of_flowers_trek.jpg"},
    {"name": "Dal Lake", "city": "Srinagar", "state": "Jammu & Kashmir", "category": "Nature", "tags": ["lake", "houseboat", "scenic", "peaceful", "photography"], "rating": 4.8, "entry_fee": 0, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Dal_lake_Srinagar.jpg/640px-Dal_lake_Srinagar.jpg"},
    {"name": "Ajanta Caves", "city": "Aurangabad", "state": "Maharashtra", "category": "Historical", "tags": ["UNESCO", "caves", "art", "heritage", "Buddhist"], "rating": 4.8, "entry_fee": 40, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Ajanta_caves_1.jpg/640px-Ajanta_caves_1.jpg"},
    {"name": "Radhanagar Beach", "city": "Havelock Island", "state": "Andaman & Nicobar", "category": "Beach", "tags": ["beach", "island", "snorkeling", "coral", "pristine"], "rating": 4.9, "entry_fee": 0, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Radhanagar_Beach.jpg/640px-Radhanagar_Beach.jpg"},
    {"name": "Rann of Kutch", "city": "Bhuj", "state": "Gujarat", "category": "Nature", "tags": ["salt desert", "unique", "festival", "photography", "offbeat"], "rating": 4.8, "entry_fee": 0, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Rann_of_Kutch.jpg/640px-Rann_of_Kutch.jpg"},
    {"name": "Jim Corbett National Park", "city": "Ramnagar", "state": "Uttarakhand", "category": "Wildlife", "tags": ["tiger", "safari", "wildlife", "national park", "nature"], "rating": 4.7, "entry_fee": 200, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Jim_Corbett_National_Park.jpg/640px-Jim_Corbett_National_Park.jpg"},
]

@recommend_bp.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    interests = [i.lower() for i in data.get('interests', [])]
    budget_type = data.get('budget_type', 'any')
    state_pref = data.get('state', '').lower()

    if not interests:
        return jsonify({"success": True, "data": PLACES[:8]})

    scored = []
    for place in PLACES:
        score = sum(1 for interest in interests if interest in place['tags'])
        if score > 0:
            p = dict(place)
            p['match_score'] = score
            p['match_percent'] = round((score / len(interests)) * 100)
            scored.append(p)

    scored.sort(key=lambda x: (x['match_score'], x['rating']), reverse=True)

    if budget_type == 'budget':
        scored = [p for p in scored if p['entry_fee'] <= 100]
    if state_pref:
        scored = [p for p in scored if state_pref in p['state'].lower()] or scored

    return jsonify({
        "success": True,
        "data": scored[:8],
        "total_matched": len(scored),
        "interests": interests
    })