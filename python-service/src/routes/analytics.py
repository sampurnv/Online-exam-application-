"""
Flask routes for analytics endpoints
"""
from flask import Blueprint, request, jsonify
from ..services.analytics_service import AnalyticsService

analytics_bp = Blueprint('analytics', __name__)
analytics_service = AnalyticsService()


@analytics_bp.route('/performance', methods=['POST'])
def analyze_performance():
    """Generate performance analysis"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['studentScore', 'allScores']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        report = analytics_service.generate_performance_report(
            student_score=float(data['studentScore']),
            all_scores=[float(s) for s in data['allScores']],
            topic_scores=data.get('topicScores'),
            time_taken=data.get('timeTaken'),
            avg_time=data.get('avgTime')
        )
        
        return jsonify({
            'success': True,
            'report': report
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@analytics_bp.route('/statistics', methods=['POST'])
def calculate_statistics():
    """Calculate statistical measures"""
    try:
        data = request.get_json()
        
        if 'scores' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required field: scores'
            }), 400
        
        statistics = analytics_service.calculate_statistics(
            [float(s) for s in data['scores']]
        )
        
        return jsonify({
            'success': True,
            'statistics': statistics
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@analytics_bp.route('/percentile', methods=['POST'])
def calculate_percentile():
    """Calculate percentile rank"""
    try:
        data = request.get_json()
        
        if 'score' not in data or 'allScores' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required fields: score, allScores'
            }), 400
        
        percentile = analytics_service.calculate_percentile(
            float(data['score']),
            [float(s) for s in data['allScores']]
        )
        
        return jsonify({
            'success': True,
            'percentile': percentile
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
