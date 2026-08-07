# backend/routes/recognize.py
import io
import json

from flask import Blueprint, request, jsonify
from PIL import Image

recognize_bp = Blueprint('recognize', __name__)

ALLOWED_TYPES = {'image/png', 'image/jpeg', 'image/jpg', 'image/webp'}
MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5MB
CONFIDENCE_THRESHOLD = 0.15
MODEL = "openai/clip-vit-base-patch32"

DEFAULT_LABELS = [
    "Taj Mahal", "Red Fort", "India Gate", "Gateway of India",
    "Hawa Mahal", "Golden Temple", "Qutub Minar", "Mysore Palace",
    "Charminar", "Lotus Temple", "Amber Fort", "Victoria Memorial",
    "Konark Sun Temple", "Ajanta Caves", "Ellora Caves"
]

NO_MATCH_LABEL = "none of these / not a recognizable landmark"

# The model is loaded once, lazily, on the first request - not at server
# startup - so `python app.py` still starts instantly. The first photo
# you submit will be slow (~20-40s) while it downloads and loads; every
# request after that is fast (a few seconds on CPU).
_classifier = None


def get_classifier():
    global _classifier
    if _classifier is None:
        from transformers import pipeline
        _classifier = pipeline("zero-shot-image-classification", model=MODEL)
    return _classifier


@recognize_bp.route('/recognize', methods=['POST'])
def recognize_place():
    if 'photo' not in request.files:
        return jsonify({'error': 'No photo uploaded'}), 400

    file = request.files['photo']

    if file.content_type not in ALLOWED_TYPES:
        return jsonify({'error': 'Unsupported image type. Use JPG, PNG, or WEBP.'}), 400

    image_bytes = file.read()

    if not image_bytes:
        return jsonify({'error': 'Empty file'}), 400

    if len(image_bytes) > MAX_SIZE_BYTES:
        return jsonify({'error': 'Image too large (max 5MB)'}), 400

    try:
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    except Exception:
        return jsonify({'error': 'Could not read this image file. Please try a different photo.'}), 400

    raw_labels = request.form.get('labels')
    try:
        labels = json.loads(raw_labels) if raw_labels else []
    except (TypeError, ValueError):
        labels = []

    if not labels:
        labels = list(DEFAULT_LABELS)
    else:
        seen = set()
        deduped = []
        for name in labels:
            if name not in seen:
                seen.add(name)
                deduped.append(name)
        labels = deduped[:150]

    labels.append(NO_MATCH_LABEL)

    try:
        classifier = get_classifier()
        result = classifier(image, candidate_labels=labels)
    except Exception as e:
        import traceback
        traceback.print_exc()  # full details in your Flask terminal
        return jsonify({'error': f'Recognition failed: {str(e)} (see Flask terminal for details)'}), 500

    if not result:
        return jsonify({'error': 'Recognition returned no result. Please try again.'}), 502

    top = result[0]
    top_label = top['label']
    top_score = float(top['score'])

    if top_label == NO_MATCH_LABEL or top_score < CONFIDENCE_THRESHOLD:
        return jsonify({
            'name': None,
            'confidence': 'low',
            'description': "This doesn't clearly match a known place. Try a clearer or closer photo."
        })

    confidence = 'high' if top_score > 0.5 else ('medium' if top_score > 0.25 else 'low')

    return jsonify({
        'name': top_label,
        'confidence': confidence,
        'score': round(top_score, 3)
    })