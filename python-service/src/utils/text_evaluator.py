"""
Text similarity utility for evaluating subjective answers
"""
import re
from typing import List, Tuple
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Download required NLTK data (run once)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')


class TextEvaluator:
    """Evaluates text similarity and quality"""
    
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
    
    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text"""
        # Convert to lowercase
        text = text.lower()
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        # Remove extra whitespace
        text = ' '.join(text.split())
        return text
    
    def tokenize_and_remove_stopwords(self, text: str) -> List[str]:
        """Tokenize text and remove stopwords"""
        tokens = word_tokenize(text)
        filtered_tokens = [w for w in tokens if w not in self.stop_words]
        return filtered_tokens
    
    def calculate_cosine_similarity(self, text1: str, text2: str) -> float:
        """Calculate cosine similarity between two texts"""
        try:
            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform([text1, text2])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(similarity)
        except Exception as e:
            print(f"Error calculating similarity: {e}")
            return 0.0
    
    def check_keywords(self, text: str, keywords: List[str]) -> Tuple[int, float]:
        """Check how many keywords are present in the text"""
        text = self.preprocess_text(text)
        tokens = set(self.tokenize_and_remove_stopwords(text))
        
        if not keywords:
            return 0, 0.0
        
        matches = sum(1 for keyword in keywords if keyword.lower() in tokens)
        percentage = (matches / len(keywords)) * 100
        
        return matches, percentage
    
    def evaluate_answer(
        self,
        student_answer: str,
        model_answer: str,
        keywords: List[str] = None,
        max_marks: float = 10.0
    ) -> dict:
        """
        Evaluate a student's answer against a model answer
        
        Returns:
            dict with marks_awarded, similarity_score, keyword_match, and feedback
        """
        if not student_answer or len(student_answer.strip()) < 10:
            return {
                'marks_awarded': 0,
                'similarity_score': 0,
                'keyword_match': 0,
                'feedback': 'Answer is too short or empty'
            }
        
        # Preprocess texts
        student_text = self.preprocess_text(student_answer)
        model_text = self.preprocess_text(model_answer)
        
        # Calculate similarity
        similarity = self.calculate_cosine_similarity(student_text, model_text)
        
        # Check keywords if provided
        keyword_score = 0
        if keywords and len(keywords) > 0:
            matched_keywords, keyword_percentage = self.check_keywords(
                student_answer, keywords
            )
            keyword_score = keyword_percentage / 100
        
        # Calculate final score (70% similarity + 30% keywords)
        if keywords and len(keywords) > 0:
            final_score = (similarity * 0.7) + (keyword_score * 0.3)
        else:
            final_score = similarity
        
        # Calculate marks
        marks_awarded = final_score * max_marks
        
        # Generate feedback
        feedback = self.generate_feedback(similarity, keyword_score, marks_awarded, max_marks)
        
        return {
            'marks_awarded': round(marks_awarded, 2),
            'similarity_score': round(similarity, 2),
            'keyword_match': round(keyword_score * 100, 2),
            'feedback': feedback
        }
    
    def generate_feedback(
        self,
        similarity: float,
        keyword_score: float,
        marks: float,
        max_marks: float
    ) -> str:
        """Generate feedback based on evaluation"""
        percentage = (marks / max_marks) * 100
        
        if percentage >= 90:
            return "Excellent answer! Very comprehensive and accurate."
        elif percentage >= 75:
            return "Good answer with most key points covered."
        elif percentage >= 60:
            return "Satisfactory answer but missing some important details."
        elif percentage >= 40:
            return "Basic understanding shown but needs more elaboration."
        else:
            return "Answer needs significant improvement. Please review the topic."


class PlagiarismChecker:
    """Check for plagiarism between texts"""
    
    def __init__(self):
        self.evaluator = TextEvaluator()
    
    def check_plagiarism(
        self,
        text: str,
        compare_texts: List[str],
        threshold: float = 0.8
    ) -> dict:
        """
        Check if text is plagiarized from other texts
        
        Args:
            text: The text to check
            compare_texts: List of texts to compare against
            threshold: Similarity threshold for plagiarism (default 0.8)
        
        Returns:
            dict with plagiarism_detected, max_similarity, and matched_indices
        """
        if not text or not compare_texts:
            return {
                'plagiarism_detected': False,
                'max_similarity': 0,
                'matched_indices': []
            }
        
        similarities = []
        for compare_text in compare_texts:
            similarity = self.evaluator.calculate_cosine_similarity(text, compare_text)
            similarities.append(similarity)
        
        max_similarity = max(similarities) if similarities else 0
        matched_indices = [
            i for i, sim in enumerate(similarities) if sim >= threshold
        ]
        
        return {
            'plagiarism_detected': max_similarity >= threshold,
            'max_similarity': round(max_similarity, 2),
            'matched_indices': matched_indices,
            'all_similarities': [round(s, 2) for s in similarities]
        }
