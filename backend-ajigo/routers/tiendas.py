from fastapi import APIRouter
from ..schemas.tiendas import RestaurantResponse, DishResponse
from typing import List

router = APIRouter(prefix="/restaurants", tags=["Restaurants & Menus"])

# Copia fiel de la data estructurada del Frontend para consistencia inicial
MOCK_RESTAURANTS_DATA = [
    {"id": "piedra-negra", "name": "Piedra Negra", "tagline": "Cafetería Fina & Postres Exclusivos", "rating": 4.9, "badgeText": "PN", "bannerColor": "from-pink-950 to-pink-900", "description": "El rincón del buen café y los postres artesanales en la UIDE.", "useImage": True, "imageSrc": "/piedra-negra-logo.png"},
    {"id": "el-capi", "name": "El Capi", "tagline": "Especialistas en Bolones & Tigrillos criollos", "rating": 4.9, "badgeText": "EC", "bannerColor": "from-cyan-950 to-cyan-900", "description": "Los bolones de verde y tigrillos mán crujientes del campus.", "useImage": False},
    {"id": "collage", "name": "Collage", "tagline": "Tu Mini Market Universitario", "rating": 4.8, "badgeText": "CO", "bannerColor": "from-purple-950 to-purple-900", "description": "Piqueos, chocolates, gaseosas, energizantes y suministros rápidos."},
    {"id": "uide-bakery", "name": "UIDE Bakery", "tagline": "Panes de Masa Madre & Repostería Fina", "rating": 4.9, "badgeText": "UB", "bannerColor": "from-amber-950 to-amber-900", "description": "Panadería artesanal horneada directamente en el campus de la UIDE.", "useImage": True, "imageSrc": "/uide-bakery-1.png"}
]

MOCK_DISHES_DATA = [
    {"id": "pn1", "name": "Espresso Americano Orgánico", "description": "Extracción doble de café de especialidad.", "price": 6.50, "category": "piedra-negra", "restaurant": "Piedra Negra", "rating": 4.9, "badgeText": "PN", "tag": "Café", "spicyLevel": 0},
    {"id": "ec1", "name": "Bolón de Queso Criollo", "description": "Masa crujiente de plátano verde frito majado.", "price": 8.00, "category": "el-capi", "restaurant": "El Capi", "rating": 4.9, "badgeText": "EC", "tag": "Bolón", "spicyLevel": 0},
    {"id": "co1", "name": "Papas Fritas Lays Clásicas", "description": "Bolsa tamaño familiar (150g).", "price": 6.00, "category": "collage", "restaurant": "Collage", "rating": 4.7, "badgeText": "CO", "tag": "Mini Market", "spicyLevel": 0},
    {"id": "ub1", "name": "Croissant Hojaldrado Francés", "description": "Croissant artesanal elaborado con 100% mantequilla pura.", "price": 5.00, "category": "uide-bakery", "restaurant": "UIDE Bakery", "rating": 4.9, "badgeText": "UB", "tag": "Panadería", "spicyLevel": 0}
]

@router.get("/", response_model=List[RestaurantResponse])
async def get_restaurants():
    return MOCK_RESTAURANTS_DATA

@router.get("/dishes", response_model=List[DishResponse])
async def get_all_dishes():
    return MOCK_DISHES_DATA

@router.get("/{restaurant_id}/dishes", response_model=List[DishResponse])
async def get_dishes_by_restaurant(restaurant_id: str):
    return [dish for dish in MOCK_DISHES_DATA if dish["category"] == restaurant_id]