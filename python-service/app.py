"""
Python Microservice for Online Examination Application
Handles AI-based evaluation, plagiarism detection, and analytics
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import blueprints
from src.routes.evaluation import evaluation_bp
from src.routes.analytics import analytics_bp

# Create Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, origins=['http://localhost:3000', 'http://localhost:5000'])

# Register blueprints
app.register_blueprint(evaluation_bp, url_prefix='/evaluate')
app.register_blueprint(analytics_bp, url_prefix='/analytics')


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Python microservice is running',
        'service': 'exam-evaluation'
    }), 200


@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'success': True,
        'message': 'Online Exam Python Microservice',
        'version': '1.0.0',
        'endpoints': {
            'evaluation': {
                'subjective': '/evaluate/subjective',
                'plagiarism': '/evaluate/plagiarism',
                'batch': '/evaluate/batch'
            },
            'analytics': {
                'performance': '/analytics/performance',
                'statistics': '/analytics/statistics',
                'percentile': '/analytics/percentile'
            }
        }
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_ENV', 'production') == 'development'
    
    print(f"Starting Python microservice on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
