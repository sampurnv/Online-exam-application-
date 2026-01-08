# Python Microservice for Online Examination Application

## Overview
This Python microservice provides AI-based evaluation, plagiarism detection, and performance analytics for the Online Examination Application.

## Features

1. **Subjective Answer Evaluation**
   - NLP-based text similarity analysis
   - Keyword matching
   - Automatic scoring with feedback

2. **Plagiarism Detection**
   - Text similarity comparison
   - Configurable threshold
   - Multiple text comparison

3. **Performance Analytics**
   - Statistical analysis
   - Percentile calculation
   - Strength/weakness identification
   - Study recommendations

## Setup

### Prerequisites
- Python 3.8 or higher
- pip

### Installation

1. Navigate to the python-service directory:
```bash
cd python-service
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Download NLTK data:
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

6. Create `.env` file:
```bash
cp .env.example .env
```

7. Configure environment variables in `.env`

### Running the Service

```bash
python app.py
```

The service will start on `http://localhost:5001`

## API Endpoints

### Evaluation Endpoints

#### 1. Evaluate Subjective Answer
```
POST /evaluate/subjective
```

**Request Body:**
```json
{
  "question": "Explain photosynthesis",
  "answer": "Student's answer...",
  "modelAnswer": "Expected answer...",
  "keywords": ["chlorophyll", "sunlight", "glucose"],
  "maxMarks": 10
}
```

**Response:**
```json
{
  "success": true,
  "marks_awarded": 7.5,
  "max_marks": 10,
  "similarity": 0.75,
  "keyword_match": 66.67,
  "feedback": "Good answer with most key points covered."
}
```

#### 2. Check Plagiarism
```
POST /evaluate/plagiarism
```

**Request Body:**
```json
{
  "text": "Text to check...",
  "compareWith": ["Text 1...", "Text 2..."],
  "threshold": 0.8
}
```

**Response:**
```json
{
  "success": true,
  "plagiarism_detected": false,
  "similarity": 0.45,
  "matched_with": [],
  "all_similarities": [0.45, 0.32]
}
```

#### 3. Batch Evaluation
```
POST /evaluate/batch
```

**Request Body:**
```json
{
  "evaluations": [
    {
      "question": "...",
      "student_answer": "...",
      "model_answer": "...",
      "max_marks": 10
    }
  ]
}
```

### Analytics Endpoints

#### 1. Performance Analysis
```
POST /analytics/performance
```

**Request Body:**
```json
{
  "studentScore": 85,
  "allScores": [70, 80, 85, 90, 75],
  "topicScores": {
    "Math": 90,
    "Science": 80
  },
  "timeTaken": 120,
  "avgTime": 100
}
```

#### 2. Calculate Statistics
```
POST /analytics/statistics
```

**Request Body:**
```json
{
  "scores": [70, 80, 85, 90, 75]
}
```

#### 3. Calculate Percentile
```
POST /analytics/percentile
```

**Request Body:**
```json
{
  "score": 85,
  "allScores": [70, 80, 85, 90, 75]
}
```

## Technology Stack

- **Flask**: Web framework
- **NLTK**: Natural language processing
- **scikit-learn**: Machine learning and text analysis
- **NumPy**: Numerical computations

## Architecture

```
python-service/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── src/
│   ├── routes/
│   │   ├── evaluation.py  # Evaluation endpoints
│   │   └── analytics.py   # Analytics endpoints
│   ├── services/
│   │   ├── evaluation_service.py
│   │   └── analytics_service.py
│   └── utils/
│       └── text_evaluator.py
```

## Integration with Node.js Backend

The Node.js backend communicates with this Python service via REST API:

1. When a student submits an exam with subjective answers
2. Node.js sends a POST request to `/evaluate/subjective`
3. Python service evaluates and returns scores
4. Node.js saves the results to MongoDB

## Development

### Running Tests
```bash
# Add test commands here
pytest tests/
```

### Code Style
```bash
# Format code
black src/
```

## Deployment

### Using Docker (Optional)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

### Production Considerations
- Use a production WSGI server like Gunicorn
- Set up proper logging
- Configure CORS for production domains
- Use environment-specific configurations
