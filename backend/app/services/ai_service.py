"""AI/NLP service for grievance analysis and classification"""

from typing import Optional, List, Dict, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from app.core.logging import get_logger
from app.core.config import settings
from app.models.grievance import GrievanceCategory, GrievanceUrgency

logger = get_logger(__name__)


class AIService:
    """Service for AI-powered grievance analysis"""
    
    # Category keywords mapping
    CATEGORY_KEYWORDS = {
        GrievanceCategory.WATER_SUPPLY: [
            "water", "tap", "supply", "tap water", "pipeline", "water bill",
            "no water", "water pressure", "water quality", "purification"
        ],
        GrievanceCategory.ROAD_MAINTENANCE: [
            "road", "pothole", "street", "highway", "pavement", "asphalt",
            "damaged road", "road condition", "maintenance", "repairing"
        ],
        GrievanceCategory.ELECTRICITY: [
            "electricity", "power", "light", "electric", "grid", "blackout",
            "power cut", "bill", "meter", "connection", "high voltage"
        ],
        GrievanceCategory.WASTE_MANAGEMENT: [
            "garbage", "waste", "trash", "rubbish", "sewage", "disposal",
            "sanitation", "dustbin", "collection", "landfill"
        ],
        GrievanceCategory.PUBLIC_HEALTH: [
            "health", "hospital", "medical", "disease", "clinic", "sanitation",
            "vaccination", "doctor", "nurse", "healthcare"
        ],
        GrievanceCategory.EDUCATION: [
            "school", "education", "student", "teacher", "college", "university",
            "course", "exam", "admission", "fees"
        ],
        GrievanceCategory.POLICE: [
            "police", "crime", "theft", "robbery", "accident", "security",
            "complaint", "investigation", "station"
        ],
        GrievanceCategory.MUNICIPAL: [
            "municipal", "city", "corporation", "permit", "license", "construction",
            "property", "tax", "registration"
        ],
        GrievanceCategory.TRANSPORT: [
            "bus", "transport", "vehicle", "traffic", "route", "fare",
            "driver", "public transport", "commute"
        ],
        GrievanceCategory.ENVIRONMENT: [
            "pollution", "environment", "air", "water", "noise", "green",
            "tree", "park", "climate", "carbon"
        ],
    }
    
    # Urgency keywords
    URGENCY_KEYWORDS = {
        GrievanceUrgency.CRITICAL: [
            "emergency", "urgent", "critical", "immediately", "dying",
            "severe", "life threatening", "accident", "disaster"
        ],
        GrievanceUrgency.HIGH: [
            "serious", "important", "asap", "quickly", "dangerous",
            "significant", "major", "substantial"
        ],
        GrievanceUrgency.MEDIUM: [
            "soon", "necessary", "needed", "required", "important",
            "considerable", "moderate"
        ],
    }
    
    def __init__(self):
        """Initialize AI service"""
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=1000,
            min_df=settings.tf_idf_min_df,
            max_df=settings.tf_idf_max_df,
            stop_words='english'
        )
        self.similarity_threshold = settings.similarity_threshold
        logger.info(f"AIService initialized with model: {settings.nlp_model}")
    
    def classify_grievance(
        self,
        text: str
    ) -> Tuple[GrievanceCategory, float]:
        """
        Classify grievance into a category using keyword matching and scoring.
        
        Args:
            text: Grievance description text
            
        Returns:
            Tuple of (category, confidence_score)
        """
        text_lower = text.lower()
        category_scores = {}
        
        # Calculate scores for each category
        for category, keywords in self.CATEGORY_KEYWORDS.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            category_scores[category] = score
        
        # Find category with highest score
        if max(category_scores.values()) == 0:
            # If no matches, default to OTHER
            return GrievanceCategory.OTHER, 0.3
        
        best_category = max(category_scores, key=category_scores.get)
        max_score = category_scores[best_category]
        
        # Normalize confidence (0-1)
        confidence = min(max_score / len(self.CATEGORY_KEYWORDS[best_category]), 1.0)
        
        logger.info(f"Classified grievance as {best_category} with confidence {confidence}")
        return best_category, confidence
    
    def detect_urgency(
        self,
        text: str
    ) -> Tuple[GrievanceUrgency, float]:
        """
        Detect urgency level of grievance.
        
        Args:
            text: Grievance description text
            
        Returns:
            Tuple of (urgency_level, confidence_score)
        """
        text_lower = text.lower()
        urgency_scores = {
            GrievanceUrgency.CRITICAL: 0,
            GrievanceUrgency.HIGH: 0,
            GrievanceUrgency.MEDIUM: 0,
            GrievanceUrgency.LOW: 1,  # Default
        }
        
        # Calculate scores for each urgency level
        for urgency, keywords in self.URGENCY_KEYWORDS.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            urgency_scores[urgency] = score
        
        # Find urgency level with highest score
        best_urgency = max(urgency_scores, key=urgency_scores.get)
        max_score = urgency_scores[best_urgency]
        
        # Normalize confidence
        total_urgency_keywords = sum(
            len(keywords) for keywords in self.URGENCY_KEYWORDS.values()
        )
        confidence = min(max_score / 3, 1.0) if max_score > 0 else 0.5
        
        logger.info(f"Detected urgency as {best_urgency} with confidence {confidence}")
        return best_urgency, confidence
    
    def detect_duplicates(
        self,
        grievance_text: str,
        existing_grievances: List[Dict]
    ) -> Optional[Dict]:
        """
        Detect if grievance is a duplicate using TF-IDF and cosine similarity.
        
        Args:
            grievance_text: New grievance text
            existing_grievances: List of existing grievance texts and IDs
                [{"id": "...", "text": "...", "status": "..."}, ...]
            
        Returns:
            Dict with duplicate info or None if no duplicate found
            {
                "duplicate_of_id": "...",
                "similarity_score": 0.85,
                "duplicate_text": "..."
            }
        """
        if not existing_grievances:
            return None
        
        try:
            # Prepare texts for vectorization
            texts = [grievance_text] + [g["text"] for g in existing_grievances]
            
            # Calculate TF-IDF vectors
            tfidf_matrix = self.tfidf_vectorizer.fit_transform(texts)
            
            # Calculate similarity between new grievance and all existing ones
            similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
            
            # Find the most similar grievance
            max_similarity_idx = np.argmax(similarities)
            max_similarity = similarities[max_similarity_idx]
            
            # Check if similarity exceeds threshold
            if max_similarity >= self.similarity_threshold:
                most_similar = existing_grievances[max_similarity_idx]
                result = {
                    "duplicate_of_id": most_similar["id"],
                    "similarity_score": float(max_similarity),
                    "duplicate_text": most_similar["text"],
                    "duplicate_status": most_similar.get("status", "unknown")
                }
                logger.info(f"Found potential duplicate with similarity {max_similarity}")
                return result
            
            return None
            
        except Exception as e:
            logger.error(f"Error detecting duplicates: {e}")
            return None
    
    def calculate_priority_score(
        self,
        urgency: GrievanceUrgency,
        category: GrievanceCategory,
        is_duplicate: bool,
        ai_confidence: float
    ) -> float:
        """
        Calculate priority score for routing (0.0 - 1.0).
        
        Args:
            urgency: Detected urgency level
            category: Detected category
            is_duplicate: Whether it's a duplicate
            ai_confidence: AI model confidence
            
        Returns:
            Priority score (0.0 = lowest, 1.0 = highest)
        """
        # Base score from urgency
        urgency_scores = {
            GrievanceUrgency.CRITICAL: 1.0,
            GrievanceUrgency.HIGH: 0.75,
            GrievanceUrgency.MEDIUM: 0.5,
            GrievanceUrgency.LOW: 0.25,
        }
        
        score = urgency_scores[urgency]
        
        # Reduce score for duplicates
        if is_duplicate:
            score *= 0.5
        
        # Factor in AI confidence
        score *= ai_confidence
        
        # Ensure score is in valid range
        score = max(0.0, min(1.0, score))
        
        logger.info(f"Calculated priority score: {score}")
        return score
    
    def analyze_grievance(
        self,
        text: str,
        existing_grievances: Optional[List[Dict]] = None
    ) -> Dict:
        """
        Perform complete AI analysis on grievance.
        
        Args:
            text: Grievance text
            existing_grievances: Existing grievances for duplicate detection
            
        Returns:
            Complete analysis result
        """
        logger.info("Starting grievance analysis")
        
        # Classify category
        category, category_confidence = self.classify_grievance(text)
        
        # Detect urgency
        urgency, urgency_confidence = self.detect_urgency(text)
        
        # Detect duplicates
        duplicate_info = None
        is_duplicate = False
        similarity_score = None
        
        if existing_grievances:
            duplicate_info = self.detect_duplicates(text, existing_grievances)
            if duplicate_info:
                is_duplicate = True
                similarity_score = duplicate_info["similarity_score"]
        
        # Use average confidence
        avg_confidence = (category_confidence + urgency_confidence) / 2
        
        # Calculate priority score
        priority_score = self.calculate_priority_score(
            urgency, category, is_duplicate, avg_confidence
        )
        
        result = {
            "category": category,
            "urgency": urgency,
            "is_duplicate": is_duplicate,
            "duplicate_of_id": duplicate_info["duplicate_of_id"] if duplicate_info else None,
            "similarity_score": similarity_score,
            "ai_confidence": avg_confidence,
            "priority_score": priority_score,
            "category_confidence": category_confidence,
            "urgency_confidence": urgency_confidence,
        }
        
        logger.info(f"Analysis complete: {result}")
        return result
