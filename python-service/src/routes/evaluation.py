"""
Flask routes for evaluation endpoints
"""
from flask import Blueprint, request, jsonify
from ..services.evaluation_service import EvaluationService

evaluation_bp = Blueprint('evaluation', __name__)
evaluation_service = EvaluationService()


@evaluation_bp.route('/subjective', methods=['POST'])
def evaluate_subjective():
    """Evaluate a subjective answer"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['answer', 'modelAnswer', 'maxMarks']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        result = evaluation_service.evaluate_subjective_answer(
            question=data.get('question', ''),
            student_answer=data['answer'],
            model_answer=data['modelAnswer'],
            keywords=data.get('keywords', []),
            max_marks=float(data['maxMarks'])
        )
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@evaluation_bp.route('/plagiarism', methods=['POST'])
def check_plagiarism():
    """Check for plagiarism"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'text' not in data or 'compareWith' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required fields: text, compareWith'
            }), 400
        
        threshold = float(data.get('threshold', 0.8))
        
        result = evaluation_service.check_plagiarism(
            text=data['text'],
            compare_texts=data['compareWith'],
            threshold=threshold
        )
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@evaluation_bp.route('/batch', methods=['POST'])
def batch_evaluate():
    """Evaluate multiple answers in batch"""
    try:
        data = request.get_json()
        
        if 'evaluations' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required field: evaluations'
            }), 400
        
        results = evaluation_service.batch_evaluate(data['evaluations'])
        
        return jsonify({
            'success': True,
            'results': results
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
