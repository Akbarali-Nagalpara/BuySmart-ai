from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ProductRawData(BaseModel):
    """Flexible schema to accept raw product data from Spring Boot/RapidAPI"""
    # Core fields (may be present with different keys)
    title: Optional[str] = None
    product_title: Optional[str] = None
    product_name: Optional[str] = None
    
    price: Optional[str] = None
    product_price: Optional[str] = None
    
    imageUrl: Optional[str] = None
    product_photo: Optional[str] = None
    
    brand: Optional[str] = None
    
    rating: Optional[float] = None
    product_star_rating: Optional[str] = None
    
    reviews: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    
    # Catch-all for other fields
    class Config:
        extra = "allow"  # Allow additional fields from raw API data


class AnalysisResult(BaseModel):
    sentiment_score: float
    feature_quality_score: float
    brand_reliability_score: float
    rating_review_score: float
    consistency_score: float
    overall_score: float
    decision: str
    reason: str
