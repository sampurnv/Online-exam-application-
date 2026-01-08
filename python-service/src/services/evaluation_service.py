"""
Evaluation service for subjective answers
"""
from typing import Dict, List
from ..utils.text_evaluator import TextEvaluator, PlagiarismChecker


class EvaluationService:
    """Service for evaluating student answers"""
    
    def __init__(self):
        self.text_evaluator = TextEvaluator()
        self.plagiarism_checker = PlagiarismChecker()
    
    def evaluate_subjective_answer(
        self,
        question: str,
        student_answer: str,
        model_answer: str,
        keywords: List[str] = None,
        max_marks: float = 10.0
    ) -> Dict:
        """
        Evaluate a subjective answer
        
        Args:
            question: The question text
            student_answer: Student's answer
            model_answer: Expected/model answer
            keywords: List of important keywords
            max_marks: Maximum marks for the question
        
        Returns:
            Dictionary with evaluation results
        """
        try:
            result = self.text_evaluator.evaluate_answer(
                student_answer=student_answer,
                model_answer=model_answer,
                keywords=keywords,
                max_marks=max_marks
            )
            
            return {
                'success': True,
                'marks_awarded': result['marks_awarded'],
                'max_marks': max_marks,
                'similarity': result['similarity_score'],
                'keyword_match': result['keyword_match'],
                'feedback': result['feedback']
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'marks_awarded': 0,
                'feedback': 'Error in automatic evaluation'
            }
    
    def check_plagiarism(
        self,
        text: str,
        compare_texts: List[str],
        threshold: float = 0.8
    ) -> Dict:
        """
        Check for plagiarism in a text
        
        Args:
            text: The text to check
            compare_texts: List of texts to compare against
            threshold: Similarity threshold for plagiarism detection
        
        Returns:
            Dictionary with plagiarism check results
        """
        try:
            result = self.plagiarism_checker.check_plagiarism(
                text=text,
                compare_texts=compare_texts,
                threshold=threshold
            )
            
            return {
                'success': True,
                'plagiarism_detected': result['plagiarism_detected'],
                'similarity': result['max_similarity'],
                'matched_with': result['matched_indices'],
                'all_similarities': result.get('all_similarities', [])
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'plagiarism_detected': False
            }
    
    def batch_evaluate(
        self,
        evaluations: List[Dict]
    ) -> List[Dict]:
        """
        Evaluate multiple answers in batch
        
        Args:
            evaluations: List of evaluation requests, each containing:
                - question
                - student_answer
                - model_answer
                - keywords (optional)
                - max_marks
        
        Returns:
            List of evaluation results
        """
        results = []
        
        for eval_request in evaluations:
            result = self.evaluate_subjective_answer(
                question=eval_request.get('question', ''),
                student_answer=eval_request.get('student_answer', ''),
                model_answer=eval_request.get('model_answer', ''),
                keywords=eval_request.get('keywords'),
                max_marks=eval_request.get('max_marks', 10.0)
            )
            results.append(result)
        
        return results
