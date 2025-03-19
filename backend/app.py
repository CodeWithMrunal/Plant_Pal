from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(debug=True)
