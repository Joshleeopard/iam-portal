from flask import Blueprint, jsonify, request
from datetime import datetime

api_bp = Blueprint('api', __name__)

# In-memory storage for now (we'll add database later)
access_requests = []

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

@api_bp.route('/requests', methods=['GET'])
def get_requests():
    """Get all access requests"""
    return jsonify({
        'requests': access_requests,
        'total': len(access_requests)
    }), 200

@api_bp.route('/requests', methods=['POST'])
def create_request():
    """Create a new access request"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email', 'access_type']
    if not all(field in data for field in required_fields):
        return jsonify({
            'error': 'Missing required fields',
            'required': required_fields
        }), 400
    
    # Create new request
    new_request = {
        'id': len(access_requests) + 1,
        'name': data['name'],
        'email': data['email'],
        'access_type': data['access_type'],
        'justification': data.get('justification', ''),
        'status': 'pending',
        'created_at': datetime.utcnow().isoformat()
    }
    
    access_requests.append(new_request)
    
    return jsonify(new_request), 201