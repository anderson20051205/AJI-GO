import React, { useState } from 'react';
import {
  Store, TrendingUp, DollarSign, ShoppingBag, CheckCircle2,
  Clock, MapPin, QrCode, TrendingDown, Plus, BarChart3, AlertCircle, Trash2, X, Eye, UtensilsCrossed, Pencil
} from 'lucide-react';
import { Order, User, Dish, Restaurant } from '../../types';

// INTERFAZ PARA DEFINIR LAS PROPIEDADES DEL COMPONENTE DE ADMINISTRACIÓN DEL LOCAL
interface RestaurantAdminProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: number) => void;
  user: User | null;
  dishes: Dish[];
  onAddDish: (newDish: Dish) => void;
  onDeleteDish?: (dishId: string) => void;
  onEditDish: (updatedDish: Dish) => void;
  restaurants: Restaurant[];
  onUpdateRestaurant: (updatedRest: Restaurant) => void;
  onUpdateUser: (updatedUser: User) => void;
}

interface Expense {
  id: number;
  name: string;
  amount: number;
  restaurant: string;
}

const getThemeClasses = (restaurant: string) => {
  switch (restaurant) {
    case 'Piedra Negra':
      return {
        bg: 'bg-pink-500',
        text: 'text-pink-500',
        border: 'border-pink-500',
        hoverBg: 'hover:bg-pink-600',
        borderB: 'border-b-pink-500',
        fromTo: 'from-pink-700 to-pink-500',
        groupHoverFromTo: 'group-hover:from-pink-600 group-hover:to-pink-400',
        focusBorder: 'focus:border-pink-500',
        bgHover: 'hover:border-pink-500/30'
      };
    case 'El Capi':
      return {
        bg: 'bg-cyan-500',
        text: 'text-cyan-500',
        border: 'border-cyan-500',
        hoverBg: 'hover:bg-cyan-600',
        borderB: 'border-b-cyan-500',
        fromTo: 'from-cyan-700 to-cyan-500',
        groupHoverFromTo: 'group-hover:from-cyan-600 group-hover:to-cyan-400',
        focusBorder: 'focus:border-cyan-500',
        bgHover: 'hover:border-cyan-500/30'
      };
    case 'Collage':
      return {
        bg: 'bg-purple-500',
        text: 'text-purple-500',
        border: 'border-purple-500',
        hoverBg: 'hover:bg-purple-600',
        borderB: 'border-b-purple-500',
        fromTo: 'from-purple-700 to-purple-500',
        groupHoverFromTo: 'group-hover:from-purple-600 group-hover:to-purple-400',
        focusBorder: 'focus:border-purple-500',
        bgHover: 'hover:border-purple-500/30'
      };
    case 'UIDE Bakery':
      return {
        bg: 'bg-amber-500',
        text: 'text-amber-500',
        border: 'border-amber-500',
        hoverBg: 'hover:bg-amber-600',
        borderB: 'border-b-amber-500',
        fromTo: 'from-amber-700 to-amber-500',
        groupHoverFromTo: 'group-hover:from-amber-600 group-hover:to-amber-400',
        focusBorder: 'focus:border-amber-500',
        bgHover: 'hover:border-amber-500/30'
      };
    case 'El Cargo':
      return {
        bg: 'bg-emerald-500',
        text: 'text-emerald-500',
        border: 'border-emerald-500',
        hoverBg: 'hover:bg-emerald-600',
        borderB: 'border-b-emerald-500',
        fromTo: 'from-emerald-700 to-emerald-500',
        groupHoverFromTo: 'group-hover:from-emerald-600 group-hover:to-emerald-400',
        focusBorder: 'focus:border-emerald-500',
        bgHover: 'hover:border-emerald-500/30'
      };
    case 'Toscana':
      return {
        bg: 'bg-rose-500',
        text: 'text-rose-500',
        border: 'border-rose-500',
        hoverBg: 'hover:bg-rose-600',
        borderB: 'border-b-rose-500',
        fromTo: 'from-rose-700 to-rose-500',
        groupHoverFromTo: 'group-hover:from-rose-600 group-hover:to-rose-400',
        focusBorder: 'focus:border-rose-500',
        bgHover: 'hover:border-rose-500/30'
      };
    case 'Happy Coffee':
      return {
        bg: 'bg-yellow-500',
        text: 'text-yellow-500',
        border: 'border-yellow-500',
        hoverBg: 'hover:bg-yellow-600',
        borderB: 'border-b-yellow-500',
        fromTo: 'from-yellow-700 to-yellow-500',
        groupHoverFromTo: 'group-hover:from-yellow-600 group-hover:to-yellow-400',
        focusBorder: 'focus:border-yellow-500',
        bgHover: 'hover:border-yellow-500/30'
      };
    case 'La Hueca':
      return {
        bg: 'bg-orange-500',
        text: 'text-orange-500',
        border: 'border-orange-500',
        hoverBg: 'hover:bg-orange-600',
        borderB: 'border-b-orange-500',
        fromTo: 'from-orange-700 to-orange-500',
        groupHoverFromTo: 'group-hover:from-orange-600 group-hover:to-orange-400',
        focusBorder: 'focus:border-orange-500',
        bgHover: 'hover:border-orange-500/30'
      };
    case 'Hanaska':
      return {
        bg: 'bg-indigo-500',
        text: 'text-indigo-500',
        border: 'border-indigo-500',
        hoverBg: 'hover:bg-indigo-600',
        borderB: 'border-b-indigo-500',
        fromTo: 'from-indigo-700 to-indigo-500',
        groupHoverFromTo: 'group-hover:from-indigo-600 group-hover:to-indigo-400',
        focusBorder: 'focus:border-indigo-500',
        bgHover: 'hover:border-indigo-500/30'
      };
    default:
      return {
        bg: 'bg-brand-orange',
        text: 'text-brand-orange',
        border: 'border-brand-orange',
        hoverBg: 'hover:bg-brand-orange/95',
        borderB: 'border-b-brand-orange',
        fromTo: 'from-brand-red to-brand-orange',
        groupHoverFromTo: 'group-hover:from-brand-orange group-hover:to-brand-yellow',
        focusBorder: 'focus:border-brand-orange',
        bgHover: 'hover:border-brand-orange/30'
      };
  }
};

export default function RestaurantAdmin({
  orders,
  onUpdateOrderStatus,
  user,
  dishes,
  onAddDish,
  onDeleteDish,
  onEditDish,
  restaurants,
  onUpdateRestaurant,
  onUpdateUser
}: RestaurantAdminProps) {
  const selectedRestaurant = user?.restaurantAdminFor || 'Piedra Negra';
  const theme = getThemeClasses(selectedRestaurant);
  const [activeTab, setActiveTab] = useState<'deliveries' | 'accounting' | 'products' | 'info' | 'preview'>('deliveries');

  // ESTADO DE EDICIÓN DE PRODUCTOS
  const [editingDishId, setEditingDishId] = useState<string | null>(null);

  // OBTENER IDENTIFICADOR Y DETALLES DEL LOCAL ACTIVO
  const activeRestaurantObj = restaurants.find(r => r.name === selectedRestaurant) || restaurants[0];
  const restaurantId = activeRestaurantObj?.id || 'piedra-negra';
  const badgeText = activeRestaurantObj?.badgeText || 'AJI';

  // ESTADOS Y METODOS PARA VARIANTES Y EXTRAS
  const [newProductSizes, setNewProductSizes] = useState<{ name: string; priceAdd: number }[]>([]);
  const [sizeInputName, setSizeInputName] = useState('');
  const [sizeInputPrice, setSizeInputPrice] = useState('');

  const [newProductExtras, setNewProductExtras] = useState<{ name: string; price: number }[]>([]);
  const [extraInputName, setExtraInputName] = useState('');
  const [extraInputPrice, setExtraInputPrice] = useState('');

  const handleAddSizeOption = () => {
    if (!sizeInputName.trim()) return;
    const price = parseFloat(sizeInputPrice) || 0;
    setNewProductSizes([...newProductSizes, { name: sizeInputName.trim(), priceAdd: price }]);
    setSizeInputName('');
    setSizeInputPrice('');
  };

  const handleRemoveSizeOption = (index: number) => {
    setNewProductSizes(newProductSizes.filter((_, idx) => idx !== index));
  };

  const handleAddExtraOption = () => {
    if (!extraInputName.trim() || !extraInputPrice) return;
    const price = parseFloat(extraInputPrice);
    if (isNaN(price) || price < 0) return;
    setNewProductExtras([...newProductExtras, { name: extraInputName.trim(), price }]);
    setExtraInputName('');
    setExtraInputPrice('');
  };

  const handleRemoveExtraOption = (index: number) => {
    setNewProductExtras(newProductExtras.filter((_, idx) => idx !== index));
  };

  // ESTADOS PARA LA EDICIÓN DEL LOCAL
  const [editName, setEditName] = useState(activeRestaurantObj?.name || '');
  const [editTagline, setEditTagline] = useState(activeRestaurantObj?.tagline || '');
  const [editDesc, setEditDesc] = useState(activeRestaurantObj?.description || '');
  const [editBannerColor, setEditBannerColor] = useState(activeRestaurantObj?.bannerColor || 'from-pink-950 to-pink-900');
  const [editImageSrc, setEditImageSrc] = useState<string | null>(activeRestaurantObj?.imageSrc || null);

  // Sincronizar estados si cambia el local activo
  React.useEffect(() => {
    if (activeRestaurantObj) {
      setEditName(activeRestaurantObj.name);
      setEditTagline(activeRestaurantObj.tagline);
      setEditDesc(activeRestaurantObj.description);
      setEditBannerColor(activeRestaurantObj.bannerColor || 'from-pink-950 to-pink-900');
      setEditImageSrc(activeRestaurantObj.imageSrc || null);
    }
  }, [activeRestaurantObj]);

  const handleSaveRestaurantProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert('El nombre del restaurante no puede estar vacío.');
      return;
    }

    const updatedRest: Restaurant = {
      ...activeRestaurantObj,
      name: editName.trim(),
      tagline: editTagline.trim(),
      description: editDesc.trim(),
      bannerColor: editBannerColor,
      imageSrc: editImageSrc || undefined,
      useImage: !!editImageSrc
    };

    onUpdateRestaurant(updatedRest);

    if (user && editName.trim() !== activeRestaurantObj.name) {
      const updatedUser = {
        ...user,
        restaurantAdminFor: editName.trim()
      };
      onUpdateUser(updatedUser);
    }

    alert('¡Información del local actualizada correctamente!');
  };

  // ESTADOS DEL REGISTRO DE PRODUCTOS
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductTag, setNewProductTag] = useState('Plato Fuerte');
  const [newProductImage, setNewProductImage] = useState<string | null>(null);

  // FILTRAR PLATOS DE ESTE LOCAL
  const restaurantDishes = dishes.filter(d => d.category === restaurantId);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductPrice) {
      alert('Por favor, completa los campos requeridos.');
      return;
    }

    const price = parseFloat(newProductPrice);
    if (isNaN(price) || price <= 0) {
      alert('Por favor, ingresa un precio válido.');
      return;
    }

    if (editingDishId) {
      const originalDish = dishes.find(d => d.id === editingDishId);
      const updatedDish: Dish = {
        id: editingDishId,
        name: newProductName.trim(),
        description: newProductDesc.trim() || 'Sin descripción.',
        price,
        category: restaurantId,
        restaurant: selectedRestaurant,
        rating: originalDish?.rating ?? 4.8,
        badgeText,
        tag: newProductTag,
        spicyLevel: originalDish?.spicyLevel ?? 0,
        imageSrc: newProductImage || undefined,
        sizes: newProductSizes,
        extras: newProductExtras
      };

      onEditDish(updatedDish);
      setEditingDishId(null);
      alert('¡Producto actualizado con éxito!');
    } else {
      const newDish: Dish = {
        id: `dish-${Date.now()}`,
        name: newProductName.trim(),
        description: newProductDesc.trim() || 'Sin descripción.',
        price,
        category: restaurantId,
        restaurant: selectedRestaurant,
        rating: 4.8,
        badgeText,
        tag: newProductTag,
        spicyLevel: 0,
        imageSrc: newProductImage || undefined,
        sizes: newProductSizes,
        extras: newProductExtras
      };

      onAddDish(newDish);
      alert('¡Producto agregado con éxito!');
    }

    // RESETEAR CAMPOS del formulario
    setNewProductName('');
    setNewProductDesc('');
    setNewProductPrice('');
    setNewProductTag('Plato Fuerte');
    setNewProductImage(null);
    setNewProductSizes([]);
    setNewProductExtras([]);
  };

  const handleCancelEdit = () => {
    setEditingDishId(null);
    setNewProductName('');
    setNewProductDesc('');
    setNewProductPrice('');
    setNewProductTag('Plato Fuerte');
    setNewProductImage(null);
    setNewProductSizes([]);
    setNewProductExtras([]);
  };

  // ESTADOS DEL REGISTRO DE GASTOS
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseName.trim() || !expenseAmount) return;
    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        name: expenseName,
        amount: parseFloat(expenseAmount),
        restaurant: selectedRestaurant
      }
    ]);
    setExpenseName('');
    setExpenseAmount('');
  };

  // FILTRO LOS PEDIDOS DEL LOCAL ACTUALMENTE COMPROBADO
  const activeOrders = orders.filter(o => o.restaurant === selectedRestaurant);

  // FILTRO LOS GASTOS DEL LOCAL SELECCIONADO
  const restaurantExpenses = expenses.filter(e => e.restaurant === selectedRestaurant);

  // CALCULOS CONTABLES DEL RESTAURANTE
  const totalSales = activeOrders.reduce((sum, o) => sum + o.total, 0);
  const totalExpenses = restaurantExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netEarnings = totalSales - totalExpenses;
  const averageTicket = activeOrders.length > 0 ? totalSales / activeOrders.length : 0;

  // Agrupar pedidos activos por horas
  const hourlySales = {
    '08:00': 0,
    '10:00': 0,
    '12:00': 0,
    '14:00': 0,
    '16:00': 0,
  };

  activeOrders.forEach(order => {
    // Extraer hora del formato "HH:MM" o "HH:MM AM/PM"
    const match = order.createdAt.match(/^(\d+):/);
    if (match) {
      let hourNum = parseInt(match[1], 10);
      
      // Manejar formato de 12 horas si el string contiene AM/PM
      if (/pm/i.test(order.createdAt) && hourNum < 12) {
        hourNum += 12;
      } else if (/am/i.test(order.createdAt) && hourNum === 12) {
        hourNum = 0;
      }

      // Asignar al rango correspondiente
      if (hourNum < 9) {
        hourlySales['08:00']++;
      } else if (hourNum < 11) {
        hourlySales['10:00']++;
      } else if (hourNum < 13) {
        hourlySales['12:00']++;
      } else if (hourNum < 15) {
        hourlySales['14:00']++;
      } else {
        hourlySales['16:00']++;
      }
    }
  });

  const chartData = [
    { hour: '08:00', sales: hourlySales['08:00'] },
    { hour: '10:00', sales: hourlySales['10:00'] },
    { hour: '12:00', sales: hourlySales['12:00'] },
    { hour: '14:00', sales: hourlySales['14:00'] },
    { hour: '16:00', sales: hourlySales['16:00'] }
  ];

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return { text: 'Recibido', color: 'text-blue-600 bg-blue-50 border-blue-100' };
      case 1: return { text: 'En Preparación', color: 'text-amber-600 bg-amber-50 border-amber-100' };
      case 2: return { text: 'Listo / En Camino', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
      case 3: return { text: 'Entregado', color: 'text-green-600 bg-green-50 border-green-100' };
      default: return { text: 'Pendiente', color: 'text-brand-muted bg-brand-border/10' };
    }
  };

  return (
    <div className="max-w-[95%] xl:max-w-[90%] 2xl:max-w-[1440px] mx-auto px-4 md:px-8 py-10 text-brand-text">

      {/* SECCIÓN DE CABECERA DE ADMINISTRACIÓN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-brand-border/40 pb-6 mb-8 text-left">
        <div>
          <span className="text-xs bg-brand-orange/15 text-brand-orange px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-brand-orange/10">
            PORTAL DE SOCIOS UIDE - {selectedRestaurant.toUpperCase()}
          </span>
          <h2 className="text-3xl font-black text-brand-text mt-4">Gestión de Restaurante</h2>
          <p className="text-xs text-brand-muted mt-1.5 font-medium">Lleva el control de pedidos, despachos de delivery y finanzas de tu local.</p>
        </div>
      </div>

      {/* PESTAÑAS DE CONTROL */}
      <div className="flex gap-4 border-b border-brand-border/30 pb-4 mb-6 select-none">
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`flex items-center gap-2 pb-2 text-sm font-black border-b-2 transition-all cursor-pointer ${activeTab === 'deliveries'
              ? `${theme.border} ${theme.text}`
              : 'border-transparent text-brand-muted hover:text-brand-orange'
            }`}
        >
          <ShoppingBag className="w-4.5 h-4.5" />
          Control de Entregas ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('accounting')}
          className={`flex items-center gap-2 pb-2 text-sm font-black border-b-2 transition-all cursor-pointer ${activeTab === 'accounting'
              ? `${theme.border} ${theme.text}`
              : 'border-transparent text-brand-muted hover:text-brand-orange'
            }`}
        >
          <TrendingUp className="w-4.5 h-4.5" />
          Contabilidad & Finanzas
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 pb-2 text-sm font-black border-b-2 transition-all cursor-pointer ${activeTab === 'products'
              ? `${theme.border} ${theme.text}`
              : 'border-transparent text-brand-muted hover:text-brand-orange'
            }`}
        >
          <Store className="w-4.5 h-4.5" />
          Gestionar Productos
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 pb-2 text-sm font-black border-b-2 transition-all cursor-pointer ${activeTab === 'info'
              ? `${theme.border} ${theme.text}`
              : 'border-transparent text-brand-muted hover:text-brand-orange'
            }`}
        >
          <Store className="w-4.5 h-4.5" />
          Mi Local (Perfil)
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 pb-2 text-sm font-black border-b-2 transition-all cursor-pointer ${activeTab === 'preview'
              ? `${theme.border} ${theme.text}`
              : 'border-transparent text-brand-muted hover:text-brand-orange'
            }`}
        >
          <Eye className="w-4.5 h-4.5" />
          Ver como Cliente
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
      {activeTab === 'deliveries' ? (
        /* PANEL DE ENTREGAS */
        <div className="space-y-6">
          {activeOrders.length === 0 ? (
            <div className="text-center py-24 bg-brand-card/25 rounded-3xl border border-dashed border-brand-border flex flex-col items-center justify-center">
              <Clock className="w-12 h-12 text-brand-muted mb-4.5" />
              <h3 className="text-xl font-black text-brand-text mb-1">Sin pedidos activos</h3>
              <p className="text-brand-muted text-xs max-w-xs mx-auto font-semibold">
                No hay transacciones pendientes para {selectedRestaurant} en este momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeOrders.map((order) => {
                const label = getStatusLabel(order.status);
                const isDelivery = order.deliveryDetails?.method === 'delivery';

                return (
                  <div
                    key={order.id}
                    className={`glass-effect rounded-3xl border p-6.5 flex flex-col justify-between gap-6 transition-all duration-300 bg-white shadow-sm border-brand-border/60 ${theme.bgHover}`}
                  >
                    {/* CABECERA INDIVIDUAL DEL PEDIDO */}
                    <div className="flex justify-between items-start border-b border-brand-border/40 pb-4.5 text-left">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-brand-text">{order.id}</span>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${label.color}`}>
                            {label.text}
                          </span>
                        </div>
                        <p className="text-[10px] text-brand-muted mt-1 font-semibold">Recibido a las: {order.createdAt}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-brand-muted block font-bold uppercase tracking-wider">TOTAL PEDIDO</span>
                        <span className="text-sm font-black text-brand-orange">S/ {order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* DETALLES DE ARTÍCULOS Y DIRECCIÓN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 text-left text-xs font-semibold">
                      <div className="space-y-2 border-r border-brand-border/20 pr-4.5">
                        <span className="text-[10px] text-brand-muted block uppercase font-bold tracking-wider mb-2">Artículos</span>
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-brand-text truncate max-w-[150px]">
                              <span className="font-black text-brand-orange mr-1">{it.quantity}x</span> {it.name}
                            </span>
                            <span className="text-brand-muted">S/ {(it.price * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] text-brand-muted block uppercase font-bold tracking-wider mb-2">Destino de Entrega</span>
                        {isDelivery ? (
                          <div className="space-y-1.5">
                            <p className="font-black text-brand-text flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                              {order.deliveryDetails.faculty}
                            </p>
                            <p className="text-[11px] text-brand-muted">
                              Piso: <span className="text-brand-text font-bold">{order.deliveryDetails.floor}</span> | Aula/Ofi: <span className="text-brand-text font-bold">{order.deliveryDetails.classroom}</span>
                            </p>
                            {order.deliveryDetails.notes && (
                              <p className="text-[10px] text-brand-muted italic mt-1.5 bg-brand-dark/45 p-2 rounded-xl border border-brand-border/40">
                                "{order.deliveryDetails.notes}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="font-black text-green-600 flex items-center gap-1.5">
                              <Store className="w-4 h-4 shrink-0" />
                              Retiro en Local
                            </p>
                            <p className="text-[11px] text-brand-muted">
                              El cliente se acercará al mostrador del local para retirar.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {order.transferReceipt && (
                      <div className="border-t border-brand-border/30 pt-3.5 space-y-2 text-left font-semibold text-xs">
                        <span className="text-[10px] text-brand-muted block uppercase font-bold tracking-wider">Comprobante de Pago</span>
                        <div className="flex items-center gap-4 bg-brand-dark/20 p-2.5 rounded-2xl border border-brand-border/40">
                          <img 
                            src={order.transferReceipt} 
                            alt="Comprobante" 
                            className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:opacity-80 border border-brand-border" 
                            onClick={() => {
                              const newTab = window.open();
                              if (newTab) {
                                newTab.document.write(`<img src="${order.transferReceipt}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                              }
                            }}
                          />
                          <div>
                            <p className="text-brand-text font-bold text-[11px]">Transferencia Bancaria</p>
                            <button 
                              type="button"
                              className="text-[10px] text-brand-orange hover:text-brand-yellow font-black underline cursor-pointer" 
                              onClick={() => {
                                const newTab = window.open();
                                if (newTab) {
                                  newTab.document.write(`<img src="${order.transferReceipt}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                                }
                              }}
                            >
                              Ver a tamaño completo
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CONTROLADORES DE CAMBIO DE ESTADO Y QR */}
                    <div className="bg-brand-dark/40 border border-brand-border/40 p-4.5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex gap-2">
                        {order.status === 0 && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 1)}
                            className="bg-brand-card hover:bg-brand-dark/20 text-[10px] font-black text-brand-text border border-brand-border px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                          >
                            Empezar Cocción
                          </button>
                        )}
                        {order.status === 1 && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 2)}
                            className="bg-brand-orange hover:bg-brand-orange/90 text-[10px] font-black text-white px-3.5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                          >
                            Listo para Despacho
                          </button>
                        )}
                        {order.status === 2 && (
                          <span className="text-[10px] text-brand-muted flex items-center gap-1.5 py-1.5 px-3 font-bold">
                            <Clock className="w-4 h-4 text-brand-orange animate-spin" style={{ animationDuration: '4s' }} />
                            Esperando repartidor / confirmación
                          </span>
                        )}
                        {order.status === 3 && (
                          <span className="text-[10px] text-green-600 flex items-center gap-1.5 py-1.5 px-3.5 font-black bg-green-500/10 border border-green-500/20 rounded-xl">
                            <CheckCircle2 className="w-4 h-4" />
                            Completado
                          </span>
                        )}
                      </div>

                      {/* VALIDACIÓN POR ESCANEO DE QR */}
                      {order.status < 3 ? (
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Validar entrega para el pedido ${order.id} mediante escaneo de código QR?`)) {
                              onUpdateOrderStatus(order.id, 3);
                            }
                          }}
                          className={`flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-[10px] font-black transition-all text-white cursor-pointer ${theme.bg} hover:opacity-90 shadow-md`}
                        >
                          <QrCode className="w-4 h-4" />
                          Escanear QR
                        </button>
                      ) : (
                        <span className="text-[10px] text-brand-muted font-black tracking-wider uppercase">PAGO REGISTRADO</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : activeTab === 'accounting' ? (
        /* PESTAÑA FINANCIERA */
        <div className="space-y-8 text-left">

          {/* CUADROS DE MÉTROS FINANCIEROS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-semibold">
            <div className="glass-effect rounded-3xl p-6.5 bg-white border border-brand-border/60">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Ventas Totales</span>
                <DollarSign className="w-5.5 h-5.5 text-green-500" />
              </div>
              <p className="text-3xl font-black text-brand-text mt-3">S/ {totalSales.toFixed(2)}</p>
              <p className="text-[10px] text-green-500 font-bold mt-1.5 flex items-center gap-1">
                <span>+12.4%</span> vs semana anterior
              </p>
            </div>

            <div className="glass-effect rounded-3xl p-6.5 bg-white border border-brand-border/60">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Gastos de Operación</span>
                <TrendingDown className="w-5.5 h-5.5 text-brand-red" />
              </div>
              <p className="text-3xl font-black text-brand-text mt-3">S/ {totalExpenses.toFixed(2)}</p>
              <p className="text-[10px] text-brand-muted mt-1.5">Materia prima e insumos UIDE</p>
            </div>

            <div className="glass-effect rounded-3xl p-6.5 bg-white border border-brand-border/60">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Ganancia Neta</span>
                <TrendingUp className="w-5.5 h-5.5 text-brand-orange" />
              </div>
              <p className={`text-3xl font-black mt-3 ${netEarnings >= 0 ? 'text-brand-text' : 'text-brand-red'}`}>
                S/ {netEarnings.toFixed(2)}
              </p>
              <p className="text-[10px] text-brand-muted mt-1.5">Neto después de deducir gastos</p>
            </div>

            <div className="glass-effect rounded-3xl p-6.5 bg-white border border-brand-border/60">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Ticket Promedio</span>
                <BarChart3 className="w-5.5 h-5.5 text-brand-yellow" />
              </div>
              <p className="text-3xl font-black text-brand-text mt-3">S/ {averageTicket.toFixed(2)}</p>
              <p className="text-[10px] text-brand-muted mt-1.5">Valor medio por pedido</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {/* DIAGRAMA DE BARRAS DE PICOS DE DEMANDA */}
              <div className="glass-effect rounded-3xl p-7 md:p-9 bg-white border border-brand-border/60">
                <h3 className="text-sm font-black text-brand-text uppercase tracking-wider mb-6">Picos de Demanda por Hora (Campus)</h3>

                <div className="h-44 flex items-end justify-between gap-3.5 border-b border-brand-border/30 pb-2 relative select-none">
                  {chartData.map((data, index) => {
                    const maxSales = Math.max(...chartData.map(d => d.sales), 10);
                    const barHeightPercent = (data.sales / maxSales) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <span className={`text-[10px] font-black ${theme.text} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                          {data.sales} ped
                        </span>
                        <div
                          className={`w-full rounded-t-lg transition-all duration-1000 bg-gradient-to-t ${theme.fromTo} ${theme.groupHoverFromTo}`}
                          style={{ height: `${barHeightPercent}%` }}
                        ></div>
                        <span className="text-[10px] text-brand-muted font-black">{data.hour}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 text-[10px] text-brand-muted mt-4 font-bold">
                  <span className="flex items-center gap-1.5"><AlertCircle className={`w-4 h-4 ${theme.text}`} /> Mayor volumen registrado a la hora del almuerzo universitario.</span>
                </div>
              </div>

              {/* REGISTRO DE TRANSACCIONES */}
              <div className="glass-effect rounded-3xl p-7 md:p-9 bg-white border border-brand-border/60">
                <h3 className="text-sm font-black text-brand-text uppercase tracking-wider mb-6">Historial de Transacciones Recientes</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left font-semibold">
                    <thead>
                      <tr className="border-b border-brand-border text-brand-muted font-bold uppercase">
                        <th className="pb-3.5">Código</th>
                        <th className="pb-3.5">Fecha/Hora</th>
                        <th className="pb-3.5">Método</th>
                        <th className="pb-3.5 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/40 text-brand-text">
                      {activeOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-brand-dark/25">
                          <td className="py-3.5 font-black text-brand-text">{order.id}</td>
                          <td className="py-3.5 text-brand-muted">{order.createdAt}</td>
                          <td className="py-3.5">
                            <span className="capitalize">{order.deliveryDetails?.method === 'delivery' ? 'Delivery' : 'Retiro'}</span>
                          </td>
                          <td className="py-3.5 text-right font-black text-brand-text">S/ {order.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* GASTOS */}
            <div className="space-y-6">

              {/* FORMULARIO DE GASTOS */}
              <div className="glass-effect rounded-3xl p-7 bg-white border border-brand-border/60">
                <h3 className="text-sm font-black text-brand-text uppercase tracking-wider mb-4">Registrar Gasto de Operación</h3>

                <form onSubmit={handleAddExpense} className="space-y-4.5">
                  <div className="space-y-2">
                    <label className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Concepto de Gasto</label>
                    <input
                      type="text"
                      placeholder="Ej. Insumos pastelería, envases"
                      value={expenseName}
                      onChange={(e) => setExpenseName(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-border rounded-xl p-3.5 text-xs text-brand-text focus:outline-none focus:border-brand-orange"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Monto (S/)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-border rounded-xl p-3.5 text-xs text-brand-text focus:outline-none focus:border-brand-orange font-bold"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full font-black text-xs py-3.5 px-4.5 rounded-xl flex items-center justify-center gap-1.5 text-white transition duration-300 cursor-pointer ${theme.bg} hover:opacity-95`}
                  >
                    <Plus className="w-4 h-4" />
                    Añadir Gasto
                  </button>
                </form>
              </div>

              {/* LISTA DE GASTOS */}
              <div className="glass-effect rounded-3xl p-7 bg-white border border-brand-border/60">
                <h3 className="text-sm font-black text-brand-text uppercase tracking-wider mb-4">Registro de Gastos</h3>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {restaurantExpenses.length === 0 ? (
                    <p className="text-xs text-brand-muted py-4 font-semibold">No se han registrado gastos para este local.</p>
                  ) : (
                    restaurantExpenses.map((exp) => (
                      <div key={exp.id} className="flex justify-between items-center p-3.5 bg-brand-dark/40 border border-brand-border/40 rounded-xl text-xs font-semibold">
                        <span className="text-brand-text truncate max-w-[130px]">{exp.name}</span>
                        <span className="text-brand-red font-black">- S/ {exp.amount.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      ) : activeTab === 'products' ? (
        /* PESTAÑA DE GESTIÓN DE PRODUCTOS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-sans">
          {/* FORMULARIO DE AGREGAR/EDITAR PRODUCTO */}
          <div id="add-product-form-container" className="lg:col-span-5 glass-effect rounded-3xl p-8 bg-white border border-brand-border/60 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-brand-text uppercase tracking-wider">
              {editingDishId ? 'Editar Producto' : 'Añadir Nuevo Producto'}
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-6 font-semibold text-sm text-brand-text">
              <div className="space-y-1 text-left">
                <label className="text-sm font-black text-brand-text/90 uppercase tracking-wider block mb-1.5">Nombre del Producto *</label>
                <input
                  type="text"
                  placeholder="Ej. Tacos al Pastor, Jugo de Mango"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-border rounded-xl p-4 text-base text-brand-text focus:outline-none focus:border-brand-orange"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-sm font-black text-brand-text/90 uppercase tracking-wider block mb-1.5">Descripción</label>
                <textarea
                  placeholder="Describe los ingredientes, tamaño u otros detalles..."
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-brand-dark/50 border border-brand-border rounded-xl p-4 text-base text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-orange leading-relaxed"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-sm font-black text-brand-text/90 uppercase tracking-wider block mb-1.5">Precio (S/) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-border rounded-xl p-4 text-base text-brand-text focus:outline-none focus:border-brand-orange font-bold"
                    required
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-sm font-black text-brand-text/90 uppercase tracking-wider block mb-1.5">Categoría / Etiqueta</label>
                  <select
                    value={newProductTag}
                    onChange={(e) => setNewProductTag(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-border rounded-xl p-4 text-base text-brand-text focus:outline-none focus:border-brand-orange cursor-pointer"
                  >
                    <option value="Bebida">Bebida</option>
                    <option value="Postre">Postre</option>
                    <option value="Entrada">Entrada</option>
                    <option value="Plato Fuerte">Plato Fuerte</option>
                    <option value="Sándwich">Sándwich</option>
                  </select>
                </div>
              </div>

              {/* TAMAÑOS DEL PRODUCTO */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-black text-brand-text/90 uppercase tracking-wider block mb-1.5">Tamaños del Producto</label>
                <div className="flex flex-col xl:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Ej. Familiar, Grande"
                    value={sizeInputName}
                    onChange={(e) => setSizeInputName(e.target.value)}
                    className="flex-1 min-w-0 bg-brand-dark border border-brand-border rounded-xl p-4 text-base text-brand-text focus:outline-none focus:border-brand-orange"
                  />
                  <div className="flex gap-2 shrink-0 w-full xl:w-auto">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Recargo"
                      value={sizeInputPrice}
                      onChange={(e) => setSizeInputPrice(e.target.value)}
                      className="flex-1 xl:w-24 bg-brand-dark border border-brand-border rounded-xl p-4 text-base text-brand-text focus:outline-none focus:border-brand-orange font-bold min-w-0"
                    />
                    <button
                      type="button"
                      onClick={handleAddSizeOption}
                      className={`px-5 rounded-xl font-black text-sm text-white ${theme.bg} hover:opacity-90 flex items-center justify-center cursor-pointer shrink-0`}
                    >
                      +
                    </button>
                  </div>
                </div>
                {newProductSizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {newProductSizes.map((sz, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 text-xs bg-brand-dark border border-brand-border rounded-xl px-3.5 py-2 text-brand-text font-bold">
                        {sz.name} (+S/ {sz.priceAdd.toFixed(2)})
                        <button type="button" onClick={() => handleRemoveSizeOption(idx)} className="text-brand-red hover:text-red-700 font-extrabold text-sm ml-1 cursor-pointer">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* EXTRAS / TOPPINGS DEL PRODUCTO */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-black text-brand-text/90 uppercase tracking-wider block mb-1.5">Extras / Toppings</label>
                <div className="flex flex-col xl:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Ej. Extra Tocino, Queso"
                    value={extraInputName}
                    onChange={(e) => setExtraInputName(e.target.value)}
                    className="flex-1 min-w-0 bg-brand-dark border border-brand-border rounded-xl p-4 text-base text-brand-text focus:outline-none focus:border-brand-orange"
                  />
                  <div className="flex gap-2 shrink-0 w-full xl:w-auto">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Precio"
                      value={extraInputPrice}
                      onChange={(e) => setExtraInputPrice(e.target.value)}
                      className="flex-1 xl:w-24 bg-brand-dark border border-brand-border rounded-xl p-4 text-base text-brand-text focus:outline-none focus:border-brand-orange font-bold min-w-0"
                    />
                    <button
                      type="button"
                      onClick={handleAddExtraOption}
                      className={`px-5 rounded-xl font-black text-sm text-white ${theme.bg} hover:opacity-90 flex items-center justify-center cursor-pointer shrink-0`}
                    >
                      +
                    </button>
                  </div>
                </div>
                {newProductExtras.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {newProductExtras.map((ex, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 text-xs bg-brand-dark border border-brand-border rounded-xl px-3.5 py-2 text-brand-text font-bold">
                        {ex.name} (+S/ {ex.price.toFixed(2)})
                        <button type="button" onClick={() => handleRemoveExtraOption(idx)} className="text-brand-red hover:text-red-700 font-extrabold text-sm ml-1 cursor-pointer">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* CARGA DE IMAGEN DEL PRODUCTO */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-black text-brand-text/90 uppercase tracking-wider block mb-1.5">Imagen del Producto</label>
                <div className="border-2 border-dashed border-brand-border rounded-2xl p-6 bg-brand-dark/30 hover:bg-brand-dark/50 transition-colors flex flex-col items-center justify-center cursor-pointer relative min-h-[110px]">
                  {newProductImage ? (
                    <div className="relative w-full flex flex-col items-center gap-1.5">
                      <img src={newProductImage} alt="Producto" className="max-h-24 rounded-lg object-contain border border-brand-border" />
                      <button
                        type="button"
                        onClick={() => setNewProductImage(null)}
                        className="absolute -top-2 -right-2 bg-brand-red text-white p-1 rounded-full hover:bg-brand-red/90 flex items-center justify-center cursor-pointer shadow-md"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-full flex flex-col items-center justify-center gap-1.5 cursor-pointer">
                      <svg className="w-7.5 h-7.5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-xs font-bold text-brand-muted">Cargar Foto de Producto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewProductImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {editingDishId ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className={`flex-1 font-black text-sm py-4 px-5 rounded-xl flex items-center justify-center gap-1.5 text-white transition duration-300 cursor-pointer ${theme.bg} hover:opacity-95`}
                  >
                    <Pencil className="w-4.5 h-4.5" />
                    Actualizar Producto
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 font-black text-sm py-4 px-5 rounded-xl flex items-center justify-center gap-1.5 bg-brand-dark hover:bg-brand-border/60 text-brand-text border border-brand-border transition duration-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className={`w-full font-black text-sm py-4 px-5 rounded-xl flex items-center justify-center gap-1.5 text-white transition duration-300 cursor-pointer ${theme.bg} hover:opacity-95`}
                >
                  <Plus className="w-4.5 h-4.5" />
                  Registrar Producto
                </button>
              )}
            </form>
          </div>

          {/* LISTADO DE PRODUCTOS EXISTENTES */}
          <div className="lg:col-span-7 glass-effect rounded-3xl p-8 bg-white border border-brand-border/60 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-brand-text uppercase tracking-wider">Productos en Menú ({restaurantDishes.length})</h3>

            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
              {restaurantDishes.length === 0 ? (
                <p className="text-xs text-brand-muted py-12 text-center font-semibold">No has registrado ningún producto todavía.</p>
              ) : (
                restaurantDishes.map((dish) => (
                  <div key={dish.id} className="flex flex-col sm:flex-row items-center sm:items-stretch justify-between p-5 bg-brand-dark/30 border border-brand-border/40 rounded-2xl gap-4 text-sm font-semibold">
                    <div className="flex flex-col sm:flex-row items-center gap-4.5 text-center sm:text-left flex-1 min-w-0">
                      <div className="w-18 h-18 rounded-xl bg-brand-dark border border-brand-border flex items-center justify-center text-brand-orange font-black text-sm overflow-hidden shrink-0">
                        {dish.imageSrc ? (
                          <img src={dish.imageSrc} alt={dish.name} className="w-full h-full object-cover" />
                        ) : (
                          dish.badgeText
                        )}
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <h4 className="text-base font-black text-brand-text truncate">{dish.name}</h4>
                          <span className="text-[10px] uppercase font-black text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded border border-brand-orange/15">{dish.tag}</span>
                        </div>
                        <p className="text-xs text-brand-muted line-clamp-2 mt-1.5 leading-relaxed font-medium">{dish.description}</p>
                        
                        {/* Tamaños y Extras en el listado */}
                        {((dish.sizes && dish.sizes.length > 0) || (dish.extras && dish.extras.length > 0)) && (
                          <div className="flex flex-col gap-1.5 mt-2.5 pt-2.5 border-t border-brand-border/20 text-xs text-brand-muted">
                            {dish.sizes && dish.sizes.length > 0 && (
                              <p>
                                <strong className="text-brand-text">Tamaños: </strong>
                                {dish.sizes.map(s => `${s.name} (+S/ ${s.priceAdd.toFixed(2)})`).join(', ')}
                              </p>
                            )}
                            {dish.extras && dish.extras.length > 0 && (
                              <p>
                                <strong className="text-brand-text">Extras: </strong>
                                {dish.extras.map(e => `${e.name} (+S/ ${e.price.toFixed(2)})`).join(', ')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-between sm:justify-center border-t sm:border-t-0 border-brand-border/30 pt-3 sm:pt-0 shrink-0 gap-3.5">
                      <div className="text-left sm:text-right font-black">
                        <span className="text-[10px] text-brand-muted block font-bold uppercase tracking-wider">PRECIO</span>
                        <span className="text-base text-brand-text font-black">S/ {dish.price.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDishId(dish.id);
                            setNewProductName(dish.name);
                            setNewProductDesc(dish.description);
                            setNewProductPrice(dish.price.toString());
                            setNewProductTag(dish.tag);
                            setNewProductImage(dish.imageSrc || null);
                            setNewProductSizes(dish.sizes || []);
                            setNewProductExtras(dish.extras || []);
                            
                            const formElement = document.getElementById('add-product-form-container');
                            if (formElement) {
                              formElement.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="p-2.5 rounded-xl bg-brand-orange/10 hover:bg-brand-orange/25 text-brand-orange border border-brand-orange/10 hover:border-brand-orange/20 transition-all cursor-pointer"
                          title="Editar producto"
                        >
                          <Pencil className="w-4.5 h-4.5" />
                        </button>

                        {onDeleteDish && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`¿Seguro que deseas eliminar "${dish.name}" de tu menú?`)) {
                                onDeleteDish(dish.id);
                              }
                            }}
                            className="p-2.5 rounded-xl bg-brand-red/10 hover:bg-brand-red/25 text-brand-red border border-brand-red/10 hover:border-brand-red/20 transition-all cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'info' ? (
        /* PESTAÑA DE EDICIÓN DEL PERFIL / LOCAL */
        <div className="max-w-4xl mx-auto glass-effect rounded-3xl p-8 md:p-10 bg-white border border-brand-border/60 shadow-lg space-y-8 text-left font-sans">
          <h3 className="text-xl font-black text-brand-text uppercase tracking-wider mb-1">Editar Información de Mi Local</h3>
          <p className="text-sm text-brand-muted font-medium mb-2">Actualiza los datos públicos de tu establecimiento. Cualquier cambio se reflejará inmediatamente para los clientes en el campus.</p>

          <form onSubmit={handleSaveRestaurantProfile} className="space-y-6 font-semibold text-sm text-brand-text">
            
            {/* VISTA PREVIA DEL BANNER EN VIVO */}
            <div className="space-y-2 mb-6">
              <label className="text-sm font-black text-brand-text/90 uppercase tracking-wider block mb-1.5">Vista Previa del Banner</label>
              <div className={`p-8 md:p-10 bg-gradient-to-r ${editBannerColor} rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl border border-white/10`}>
                <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                <div className="flex items-center gap-4.5 relative z-10 text-left">
                  <div className="relative w-18 h-18 rounded-2xl bg-brand-dark/95 border border-brand-border flex items-center justify-center font-black shadow-lg shrink-0 overflow-hidden">
                    {editImageSrc ? (
                      <img
                        src={editImageSrc}
                        alt={editName}
                        className="w-full h-full object-cover relative z-10"
                      />
                    ) : null}
                    {!editImageSrc && (
                      <span className="absolute text-base tracking-wider text-brand-orange font-bold">
                        {badgeText}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                        {editName || 'Nombre de tu Local'}
                      </h2>
                    </div>
                    <p className="text-xs font-black mt-1 text-brand-orange">
                      {editTagline || 'Lema / Subtítulo'}
                    </p>
                    <p className="text-xs text-white/70 mt-2 leading-relaxed max-w-xl hidden sm:block font-medium">
                      {editDesc || 'Descripción del local...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 relative z-10 bg-brand-dark/45 border border-brand-border/30 px-4.5 py-3 rounded-2xl">
                  <Clock className="w-4.5 h-4.5 text-brand-orange" />
                  <div className="text-left font-semibold">
                    <p className="text-[9px] text-brand-muted font-bold uppercase tracking-widest">MODALIDAD UIDE</p>
                    <p className="text-xs font-bold text-white">Retiro / Delivery</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-black text-brand-text/90 uppercase tracking-wider block mb-1.5">Nombre del Local *</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border rounded-xl p-4 text-base text-brand-text focus:outline-none focus:border-brand-orange"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-black text-brand-text/90 uppercase tracking-wider block mb-1.5">Lema / Subtítulo *</label>
              <input
                type="text"
                value={editTagline}
                onChange={(e) => setEditTagline(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border rounded-xl p-4 text-base text-brand-text focus:outline-none focus:border-brand-orange"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-black text-brand-text/90 uppercase tracking-wider block mb-1.5">Descripción del Local *</label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={4}
                className="w-full bg-brand-dark/50 border border-brand-border rounded-xl p-4 text-base text-brand-text focus:outline-none focus:border-brand-orange leading-relaxed"
                required
              ></textarea>
            </div>

            {/* SELECCIÓN DE COLOR DE BANNER COMO PALETA VISUAL */}
            <div className="space-y-2">
              <label className="text-sm font-black text-brand-text/90 uppercase tracking-wider block mb-1.5">Tema del Banner (Paleta de Colores)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 select-none">
                {[
                  { name: 'Rosa Fresa', val: 'from-pink-950 to-pink-900', preview: 'from-pink-600 to-pink-500' },
                  { name: 'Cian Océano', val: 'from-cyan-950 to-cyan-900', preview: 'from-cyan-600 to-cyan-500' },
                  { name: 'Morado Eléctrico', val: 'from-purple-950 to-purple-900', preview: 'from-purple-600 to-purple-500' },
                  { name: 'Ámbar Cálido', val: 'from-amber-950 to-amber-900', preview: 'from-amber-600 to-amber-500' },
                  { name: 'Esmeralda', val: 'from-emerald-950 to-emerald-900', preview: 'from-emerald-600 to-emerald-500' },
                  { name: 'Rosa Italiano', val: 'from-rose-950 to-rose-900', preview: 'from-rose-600 to-rose-500' },
                  { name: 'Oro / Amarillo', val: 'from-yellow-950 to-yellow-900', preview: 'from-yellow-600 to-yellow-500' },
                  { name: 'Naranja Fuego', val: 'from-orange-950 to-orange-900', preview: 'from-orange-600 to-orange-500' },
                  { name: 'Índigo Real', val: 'from-indigo-950 to-indigo-900', preview: 'from-indigo-600 to-indigo-500' },
                  { name: 'Azul Cobalto', val: 'from-blue-950 to-blue-900', preview: 'from-blue-600 to-blue-500' },
                  { name: 'Verde Lima', val: 'from-lime-950 to-lime-900', preview: 'from-lime-600 to-lime-500' },
                  { name: 'Violeta Amatista', val: 'from-violet-950 to-violet-900', preview: 'from-violet-600 to-violet-500' },
                  { name: 'Rojo Carmesí', val: 'from-red-950 to-red-900', preview: 'from-red-600 to-red-500' },
                  { name: 'Verde Azulado', val: 'from-teal-950 to-teal-900', preview: 'from-teal-600 to-teal-500' },
                  { name: 'Gris Carbón', val: 'from-slate-950 to-slate-900', preview: 'from-slate-600 to-slate-500' }
                ].map((c) => {
                  const usingRestaurant = restaurants.find(r => r.bannerColor === c.val);
                  const statusDesc = usingRestaurant ? `Uso: ${usingRestaurant.name}` : 'Disponible';
                  return (
                    <button
                      key={c.val}
                      type="button"
                      onClick={() => setEditBannerColor(c.val)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-2 cursor-pointer ${
                        editBannerColor === c.val
                          ? 'bg-brand-orange/10 border-brand-orange shadow-md scale-[1.02]'
                          : 'bg-brand-dark/50 border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-orange/40'
                      }`}
                    >
                      <div className={`h-4.5 w-full rounded-lg bg-gradient-to-r ${c.preview} border border-white/10 shadow-sm`}></div>
                      <div className="flex flex-col gap-0.5 min-w-0 font-sans">
                        <span className="text-xs font-black text-brand-text truncate leading-tight">{c.name}</span>
                        <span className={`text-[10px] font-bold truncate leading-none uppercase ${
                          usingRestaurant ? 'text-brand-orange animate-pulse' : 'text-green-500'
                        }`}>
                          {statusDesc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LOGO DE ESTABLECIMIENTO */}
            <div className="space-y-2 text-left">
              <label className="text-sm font-black text-brand-text/90 uppercase tracking-wider block">Ícono / Logo del Local</label>
              <div className="border-2 border-dashed border-brand-border rounded-2xl p-6 bg-brand-dark/30 hover:bg-brand-dark/50 transition-colors flex flex-col items-center justify-center cursor-pointer relative min-h-[120px]">
                {editImageSrc ? (
                  <div className="relative w-full flex flex-col items-center gap-1.5">
                    <img src={editImageSrc} alt="Logo Local" className="w-20 h-20 rounded-2xl object-cover border border-brand-border shadow-md" />
                    <button
                      type="button"
                      onClick={() => setEditImageSrc(null)}
                      className="absolute -top-2 -right-2 bg-brand-red text-white p-1 rounded-full hover:bg-brand-red/90 flex items-center justify-center cursor-pointer shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full flex flex-col items-center justify-center gap-1.5 cursor-pointer">
                    <svg className="w-8 h-8 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-xs font-bold text-brand-muted">Cargar Foto de Logo / Ícono</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditImageSrc(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full font-black text-sm py-4 px-5 rounded-xl flex items-center justify-center gap-1.5 text-white transition duration-300 cursor-pointer ${theme.bg} hover:opacity-95 shadow-md`}
            >
              <CheckCircle2 className="w-4.5 h-4.5" />
              Guardar Cambios del Local
            </button>

          </form>
        </div>
      ) : (
        /* PESTAÑA DE VISTA PREVIA VER COMO CLIENTE */
        <div className="max-w-[95%] xl:max-w-[90%] 2xl:max-w-[1440px] mx-auto space-y-8 text-left font-sans animate-fadeIn">
          {/* BANNER DE LOCAL SIMULADO */}
          <div className={`p-8 md:p-10 bg-gradient-to-r ${editBannerColor} rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl border border-white/10`}>
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

            <div className="flex items-center gap-4.5 relative z-10 text-left">
              <div className="relative w-18 h-18 rounded-2xl bg-brand-dark/95 border border-brand-border flex items-center justify-center font-black shadow-lg shrink-0 overflow-hidden">
                {editImageSrc ? (
                  <img
                    src={editImageSrc}
                    alt={editName}
                    className="w-full h-full object-cover relative z-10"
                  />
                ) : null}
                {!editImageSrc && (
                  <span className="absolute text-base tracking-wider text-brand-orange font-bold">
                    {badgeText}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {editName || 'Nombre de tu Local'}
                  </h2>
                </div>
                <p className="text-xs font-black text-brand-orange mt-1">
                  {editTagline || 'Lema / Subtítulo'}
                </p>
                <p className="text-xs text-white/70 mt-2 leading-relaxed max-w-xl hidden sm:block font-medium">
                  {editDesc || 'Descripción del local...'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 relative z-10 bg-brand-dark/45 border border-brand-border/30 px-4.5 py-3 rounded-2xl">
              <Clock className="w-4.5 h-4.5 text-brand-orange" />
              <div className="text-left font-semibold">
                <p className="text-[9px] text-brand-muted font-bold uppercase tracking-wider">MODALIDAD UIDE</p>
                <p className="text-xs font-bold text-white">Retiro / Delivery</p>
              </div>
            </div>
          </div>

          {/* MENÚ DE PLATOS SIMULADO */}
          <div className="p-8 md:p-10 bg-brand-card/20 rounded-3xl border border-brand-border/60 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-brand-text uppercase tracking-wider">Carta de Productos</h3>
              <p className="text-xs text-brand-muted mt-1 font-semibold">Así es como los clientes verán tu oferta actual en la aplicación principal.</p>
            </div>
            
            {restaurantDishes.length === 0 ? (
              <div className="text-center py-20 bg-brand-dark/30 rounded-2xl border border-dashed border-brand-border flex flex-col items-center justify-center">
                <p className="text-brand-muted text-xs font-bold">No se han registrado platos en tu menú todavía.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurantDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="group relative rounded-2xl bg-brand-dark/40 border border-brand-border/50 p-6 flex flex-col justify-between gap-4 transition-all duration-300 hover:border-brand-orange/40 hover:shadow-lg hover:shadow-brand-orange/5"
                  >
                    <div className="text-left">
                      {/* Tag de Categoría del Plato */}
                      <div className="flex justify-between items-center mb-3.5">
                        <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full border text-brand-orange bg-brand-orange/10 border-brand-orange/15">
                          {dish.tag}
                        </span>
                        <div className="w-7.5 h-7.5 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-[10px] font-black text-brand-muted">
                          {dish.badgeText}
                        </div>
                      </div>

                      {/* Imagen si existe */}
                      {dish.imageSrc && (
                        <div className="w-full h-36 rounded-xl overflow-hidden border border-brand-border/40 mb-3.5 relative">
                          <img
                            src={dish.imageSrc}
                            alt={dish.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Título y descripción */}
                      <h3 className="font-black text-base text-brand-text group-hover:text-brand-orange transition-colors">
                        {dish.name}
                      </h3>
                      <p className="text-xs text-brand-muted mt-2.5 line-clamp-3 leading-relaxed font-semibold">
                        {dish.description}
                      </p>

                      {/* Tamaños y Extras si existen */}
                      {((dish.sizes && dish.sizes.length > 0) || (dish.extras && dish.extras.length > 0)) && (
                        <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-brand-border/20 text-xs text-brand-muted">
                          {dish.sizes && dish.sizes.length > 0 && (
                            <p>
                              <strong className="text-brand-text font-black">Tamaños: </strong>
                              {dish.sizes.map(s => `${s.name} (+S/ ${s.priceAdd.toFixed(2)})`).join(', ')}
                            </p>
                          )}
                          {dish.extras && dish.extras.length > 0 && (
                            <p>
                              <strong className="text-brand-text font-black">Extras: </strong>
                              {dish.extras.map(e => `${e.name} (+S/ ${e.price.toFixed(2)})`).join(', ')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Precios e interacción simulada */}
                    <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-brand-border/30">
                      <div>
                        <span className="text-[9px] text-brand-muted block uppercase font-bold tracking-widest">PRECIO</span>
                        <span className="text-sm font-black text-brand-text">
                          S/ {dish.price.toFixed(2)}
                        </span>
                      </div>

                      <button
                        disabled
                        className="inline-flex items-center justify-center gap-1.5 text-white bg-gradient-to-r from-brand-red to-brand-orange px-4 py-2.5 rounded-xl font-black text-xs opacity-50 cursor-not-allowed"
                        title="Ordenar (Vista previa)"
                      >
                        <UtensilsCrossed className="w-4 h-4" />
                        <span>Ordenar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
