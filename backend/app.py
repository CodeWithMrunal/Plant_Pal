from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['plant_diseases']
collection = db['diseases']

# Update the ngrok URL generated from Colab
NGROK_URL = 'https://9c7e-35-237-98-250.ngrok-free.app'

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        file = request.files['image']
        
        # Forward the request to the Colab endpoint
        files = {'image': (file.filename, file.stream, file.mimetype)}
        response = requests.post(f'{NGROK_URL}/predict', files=files)
        
        # Check if the response is successful
        response.raise_for_status()
        
        try:
            return jsonify(response.json())
        except ValueError:
            return jsonify({
                'error': 'Invalid JSON response from server',
                'response_text': response.text
            }), 500
            
    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': 'Failed to connect to server',
            'details': str(e)
        }), 500
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.json
        disease_name = data.get('diseaseName')
        
        # Get disease info from MongoDB
        disease_info = collection.find_one({'name': disease_name.lower()})
        
        if not disease_info:
            return jsonify({'error': 'Disease not found in database'}), 404

        # Prepare text for translation
        texts_to_translate = [
            disease_info['name'],
            disease_info['description'],
            disease_info['cure']
        ]

        # Translation API configuration
        url = "https://api.sarvam.ai/translate"
        headers = {
            "api-subscription-key": "1c4070b8-7078-4aa2-b45b-14ce2fdf5eb5",
            "Content-Type": "application/json"
        }

        translated_texts = []
        for text in texts_to_translate:
            payload = {
                "source_language_code": "en-IN",
                "target_language_code": "hi-IN",
                "speaker_gender": "Male",
                "mode": "modern-colloquial",
                "model": "mayura:v1",
                "enable_preprocessing": False,
                "numerals_format": "international",
                "output_script": "fully-native",
                "input": text
            }

            response = requests.post(url, json=payload, headers=headers)
            if response.status_code == 200:
                translated_text = response.json().get("translated_text", "Translation not available")
                translated_texts.append(translated_text)
            else:
                return jsonify({'error': 'Translation API error'}), 500

        return jsonify({
            'name': translated_texts[0],
            'description': translated_texts[1],
            'cure': translated_texts[2]
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
