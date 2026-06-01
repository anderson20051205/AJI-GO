from pydantic import BaseModel
from typing import List, Optional

class DishResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category: str
    restaurant: str
    rating: float
    badgeText: str
    tag: str
    spicyLevel: int

class RestaurantResponse(BaseModel):
    id: str
    name: str
    tagline: str
    rating: float
    badgeText: str
    bannerColor: str
    description: str
    useImage: bool = False
    imageSrc: Optional[str] = None