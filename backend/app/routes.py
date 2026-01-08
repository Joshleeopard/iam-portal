from flask import Blueprint, jsonify, request
from datetime import datetime, timezone
from app.models import db, AccessRequest

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now(timezone.utc).isoformat()
    }), 200

@api_bp.route('/requests', methods=['GET'])
def get_requests():
    """Get all access requests"""
    requests = AccessRequest.query.order_by(AccessRequest.created_at.desc()).all()
    return jsonify({
        'requests': [req.to_dict() for req in requests],
        'total': len(requests)
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
    new_request = AccessRequest(
        name=data['name'],
        email=data['email'],
        access_type=data['access_type'],
        justification=data.get('justification', ''),
        status='pending'
    )

    db.session.add(new_request)
    db.session.commit()

    return jsonify(new_request.to_dict()), 201

@api_bp.route('/requests/<int:request_id>', methods=['GET'])
def get_request(request_id):
    """Get a specific access request"""
    access_request = AccessRequest.query.get_or_404(request_id)
    return jsonify(access_request.to_dict()), 200

@api_bp.route('/requests/<int:request_id>/approve', methods=['POST'])
def approve_request(request_id):
    """Approve an access request"""
    access_request = AccessRequest.query.get_or_404(request_id)
    data = request.get_json() or {}

    if access_request.status != 'pending':
        return jsonify({
            'error': f'Request is already {access_request.status}'
        }), 400

    access_request.status = 'approved'
    access_request.approved_by = data.get('approved_by', 'System Admin')
    access_request.approval_notes = data.get('notes', '')

    db.session.commit()

    return jsonify(access_request.to_dict()), 200

@api_bp.route('/requests/<int:request_id>/reject', methods=['POST'])
def reject_request(request_id):
    """Reject an access request"""
    access_request = AccessRequest.query.get_or_404(request_id)
    data = request.get_json() or {}

    if access_request.status != 'pending':
        return jsonify({
            'error': f'Request is already {access_request.status}'
        }), 400

    access_request.status = 'rejected'
    access_request.approved_by = data.get('approved_by', 'System Admin')
    access_request.approval_notes = data.get('notes', '')

    db.session.commit()

    return jsonify(access_request.to_dict()), 200