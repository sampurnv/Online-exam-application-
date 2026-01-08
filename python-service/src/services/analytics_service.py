"""
Analytics service for performance analysis
"""
from typing import List, Dict
import numpy as np


class AnalyticsService:
    """Generate performance analytics and insights"""
    
    def calculate_percentile(self, score: float, all_scores: List[float]) -> float:
        """Calculate percentile rank of a score"""
        if not all_scores:
            return 0
        
        sorted_scores = sorted(all_scores)
        position = sum(1 for s in sorted_scores if s < score)
        percentile = (position / len(sorted_scores)) * 100
        return round(percentile, 2)
    
    def calculate_statistics(self, scores: List[float]) -> Dict:
        """Calculate statistical measures for a set of scores"""
        if not scores:
            return {
                'mean': 0,
                'median': 0,
                'std_dev': 0,
                'min': 0,
                'max': 0,
                'variance': 0
            }
        
        np_scores = np.array(scores)
        
        return {
            'mean': round(float(np.mean(np_scores)), 2),
            'median': round(float(np.median(np_scores)), 2),
            'std_dev': round(float(np.std(np_scores)), 2),
            'min': round(float(np.min(np_scores)), 2),
            'max': round(float(np.max(np_scores)), 2),
            'variance': round(float(np.var(np_scores)), 2)
        }
    
    def identify_strengths_weaknesses(
        self,
        topic_scores: Dict[str, float],
        threshold_strong: float = 75,
        threshold_weak: float = 50
    ) -> Dict:
        """
        Identify strengths and weaknesses based on topic scores
        
        Args:
            topic_scores: Dictionary of topic names and scores (percentages)
            threshold_strong: Minimum percentage for strength
            threshold_weak: Maximum percentage for weakness
        """
        strengths = []
        weaknesses = []
        
        for topic, score in topic_scores.items():
            if score >= threshold_strong:
                strengths.append(topic)
            elif score <= threshold_weak:
                weaknesses.append(topic)
        
        return {
            'strengths': strengths,
            'weaknesses': weaknesses,
            'neutral': [
                topic for topic in topic_scores.keys()
                if topic not in strengths and topic not in weaknesses
            ]
        }
    
    def generate_recommendations(
        self,
        weaknesses: List[str],
        avg_score: float
    ) -> List[str]:
        """Generate study recommendations based on performance"""
        recommendations = []
        
        if avg_score < 40:
            recommendations.append(
                "Consider reviewing fundamental concepts and basics"
            )
        elif avg_score < 60:
            recommendations.append(
                "Focus on understanding core concepts more deeply"
            )
        
        if weaknesses:
            recommendations.append(
                f"Focus on improving in: {', '.join(weaknesses)}"
            )
        
        if avg_score >= 80:
            recommendations.append(
                "Great performance! Try advanced topics to challenge yourself"
            )
        
        recommendations.append(
            "Practice more questions to improve speed and accuracy"
        )
        
        return recommendations
    
    def analyze_time_performance(
        self,
        time_taken: float,
        avg_time: float,
        total_questions: int
    ) -> Dict:
        """Analyze time management in exam"""
        time_per_question = time_taken / total_questions if total_questions > 0 else 0
        avg_time_per_question = avg_time / total_questions if total_questions > 0 else 0
        
        time_efficiency = "good"
        if time_taken > avg_time * 1.2:
            time_efficiency = "slow"
        elif time_taken < avg_time * 0.8:
            time_efficiency = "fast"
        
        return {
            'time_taken': round(time_taken, 2),
            'avg_time': round(avg_time, 2),
            'time_per_question': round(time_per_question, 2),
            'avg_time_per_question': round(avg_time_per_question, 2),
            'efficiency': time_efficiency
        }
    
    def generate_performance_report(
        self,
        student_score: float,
        all_scores: List[float],
        topic_scores: Dict[str, float] = None,
        time_taken: float = None,
        avg_time: float = None
    ) -> Dict:
        """Generate comprehensive performance report"""
        # Calculate percentile
        percentile = self.calculate_percentile(student_score, all_scores)
        
        # Calculate class statistics
        statistics = self.calculate_statistics(all_scores)
        
        # Identify strengths and weaknesses
        swot = {}
        if topic_scores:
            swot = self.identify_strengths_weaknesses(topic_scores)
        
        # Generate recommendations
        recommendations = self.generate_recommendations(
            swot.get('weaknesses', []),
            student_score
        )
        
        # Time analysis
        time_analysis = {}
        if time_taken and avg_time:
            time_analysis = self.analyze_time_performance(
                time_taken,
                avg_time,
                len(topic_scores) if topic_scores else 10
            )
        
        return {
            'percentile': percentile,
            'class_statistics': statistics,
            'strengths': swot.get('strengths', []),
            'weaknesses': swot.get('weaknesses', []),
            'recommendations': recommendations,
            'time_analysis': time_analysis
        }
