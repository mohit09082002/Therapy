from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import csv
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load data files
def load_json_file(filename):
    try:
        with open(filename, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_registration_to_csv(registration_data):
    """Save registration data to CSV file"""
    csv_file = 'registrations.csv'
    file_exists = os.path.isfile(csv_file)
    
    with open(csv_file, 'a', newline='', encoding='utf-8') as file:
        fieldnames = ['timestamp', 'role', 'full_name', 'email', 'phone', 'child_condition']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        
        # Write header if file is new
        if not file_exists:
            writer.writeheader()
        
        # Add timestamp to registration data
        registration_data['timestamp'] = datetime.now().isoformat()
        writer.writerow(registration_data)

@app.route('/')
def home():
    return jsonify({"message": "Therapist Discovery Platform API", "status": "running"})

@app.route('/api/register', methods=['POST'])
def register_user():
    """Handle user registration"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['role', 'full_name', 'email', 'phone']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Prepare registration data
        registration_data = {
            'role': data.get('role'),
            'full_name': data.get('full_name'),
            'email': data.get('email'),
            'phone': data.get('phone'),
            'child_condition': data.get('child_condition', '')  # Optional for therapists
        }
        
        # Save to CSV
        save_registration_to_csv(registration_data)
        
        return jsonify({
            "message": "Registration successful",
            "user": {
                "role": registration_data['role'],
                "full_name": registration_data['full_name'],
                "email": registration_data['email']
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/therapists', methods=['GET'])
def get_therapists():
    therapists = load_json_file('../frontend/data/therapists.json')
    return jsonify(therapists)

@app.route('/api/community/<category>', methods=['GET'])
def get_community(category):
    community_data = load_json_file('../frontend/data/community.json')
    if category in community_data:
        return jsonify(community_data[category])
    return jsonify([])

@app.route('/api/community/<category>', methods=['POST'])
def post_community(category):
    data = request.get_json()
    community_data = load_json_file('../frontend/data/community.json')
    
    if category not in community_data:
        community_data[category] = []
    
    new_post = {
        "id": len(community_data[category]) + 1,
        "title": data.get('title', ''),
        "description": data.get('description', ''),
        "comments": []
    }
    
    community_data[category].append(new_post)
    
    # Save back to file
    with open('../frontend/data/community.json', 'w') as f:
        json.dump(community_data, f, indent=2)
    
    return jsonify(new_post)

@app.route('/api/community/<category>/<int:post_id>/comments', methods=['POST'])
def add_comment(category, post_id):
    data = request.get_json()
    community_data = load_json_file('../frontend/data/community.json')
    
    if category in community_data:
        for post in community_data[category]:
            if post['id'] == post_id:
                new_comment = {
                    "id": len(post['comments']) + 1,
                    "author": data.get('author', 'Anonymous'),
                    "text": data.get('text', '')
                }
                post['comments'].append(new_comment)
                
                # Save back to file
                with open('../frontend/data/community.json', 'w') as f:
                    json.dump(community_data, f, indent=2)
                
                return jsonify(new_comment)
    
    return jsonify({"error": "Post not found"}), 404

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    # Placeholder for chatbot functionality
    return jsonify({"message": "Chatbot is under construction", "status": "placeholder"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8050, debug=True)

