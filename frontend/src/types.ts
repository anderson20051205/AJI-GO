// DEFINO LAS INTERFACES DE DATOS PARA TODO EL PROYECTO
// DE ESTA FORMA ME ASEGURO DE QUE EL FLUJO DE DATOS ESTÉ BIEN TIPADO

export interface User {
  name: string;
  email: string;
  role?: 'customer' | 'admin' | 'driver';
  points?: number;
  membership?: string;
  registrationDate?: string;
  loyaltyLevel?: string;
  phone?: string;
  driverStatus?: 'none' | 'pending' | 'approved';
  vehicleType?: string;
  universityId?: string;
  licensePlate?: string;
  restaurantAdminFor?: string;
}

export interface DishSize {
  name: string;
  priceAdd: number;
}

export interface DishExtra {
  name: string;
  price: number;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  restaurant: string;
  rating: number;
  badgeText: string;
  tag: string;
  spicyLevel: number;
  imageSrc?: string;
  sizes?: DishSize[];
  extras?: DishExtra[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  badgeText: string;
  bannerColor: string;
  description: string;
  useImage?: boolean;
  imageSrc?: string;
}

export interface CartItem {
  id: string;
  baseId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  extras: string[];
  notes: string;
  badgeText: string;
  restaurant: string;
}

export interface DeliveryDetails {
  method: 'delivery' | 'pickup';
  faculty: string;
  floor: string;
  classroom: string;
  notes: string;
}

export interface Order {
  id: string;
  items: CartItem[] | { name: string; price: number; quantity: number; badgeText: string }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  coupon: string | null;
  deliveryDetails: DeliveryDetails;
  status: number; // 0: RECIBIDO, 1: EN PREPARACIÓN, 2: EN CAMINO, 3: ENTREGADO
  createdAt: string;
  restaurant: string;
  driverName?: string;
  driverVehicle?: string;
  driverPhone?: string;
  transferReceipt?: string;
}
