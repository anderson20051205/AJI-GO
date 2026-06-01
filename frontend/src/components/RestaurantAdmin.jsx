import React, { useState } from 'react';
import { 
  Store, TrendingUp, DollarSign, ShoppingBag, 
  CheckCircle2, Clock, User, MapPin, QrCode, 
  TrendingDown, Plus, BarChart3, AlertCircle 
} from 'lucide-react';

export default function RestaurantAdmin({ orders, onUpdateOrderStatus }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState('Piedra Negra');
  const [activeTab, setActiveTab] = useState('deliveries'); // 'deliveries' or 'accounting'
  
  // Accounting input form state
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Granos de café arábica (3kg)', amount: 45.00, restaurant: 'Piedra Negra' },
    { id: 2, name: 'Cajas de empaque biodegradable', amount: 25.00, restaurant: 'Piedra Negra' },
    { id: 3, name: 'Queso criollo de Manabí (5kg)', amount: 35.00, restaurant: 'El Capi' }
  ]);

  const handleAddExpense = (e) => {
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

  // Filter orders for the active restaurant
  const activeOrders = orders.filter(o => o.restaurant === selectedRestaurant);

  // Filter expenses for the active restaurant
  const restaurantExpenses = expenses.filter(e => e.restaurant === selectedRestaurant);

  // Financial calculations
  const totalSales = activeOrders.reduce((sum, o) => sum + o.total, 0);
  const totalExpenses = restaurantExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netEarnings = totalSales - totalExpenses;
  const averageTicket = activeOrders.length > 0 ? totalSales / activeOrders.length : 0;

  // Mock sales by hour data
  const chartData = [
    { hour: '08:00', sales: 12 },
    { hour: '10:00', sales: 25 },
    { hour: '12:00', sales: 48 }, // Peak hours at UIDE
    { hour: '14:00', sales: 30 },
    { hour: '16:00', sales: 15 }
  ];

  const getStatusLabel = (status) => {
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
      
      {/* Header and Restaurant Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-brand-border/40 pb-6 mb-8 text-left">
        <div>
          <span className="text-[10px] bg-brand-orange/15 text-brand-orange px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-brand-orange/10">
            PORTAL DE SOCIOS UIDE
          </span>
          <h2 className="text-3xl font-extrabold text-brand-text mt-3">Gestión de Restaurante</h2>
          <p className="text-xs text-brand-muted mt-1">Lleva el control de pedidos, despachos de delivery y finanzas del local.</p>
        </div>

        {/* Restaurant selector buttons */}
        <div className="flex flex-wrap gap-2">
          {['Piedra Negra', 'El Capi', 'Collage', 'UIDE Bakery'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRestaurant(r)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-300 ${
                selectedRestaurant === r
                  ? r === 'Piedra Negra'
                    ? 'bg-pink-500 border-transparent text-white shadow-lg shadow-pink-500/10'
                    : 'bg-brand-orange border-transparent text-white shadow-lg shadow-brand-orange/10'
                  : 'bg-brand-card hover:bg-brand-card/85 border-brand-border text-brand-muted hover:text-brand-orange'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-4 border-b border-brand-border/30 pb-4 mb-6">
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'deliveries' 
              ? selectedRestaurant === 'Piedra Negra' ? 'border-pink-500 text-pink-500' : 'border-brand-orange text-brand-orange' 
              : 'border-transparent text-brand-muted hover:text-brand-orange'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Control de Entregas ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('accounting')}
          className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'accounting' 
              ? selectedRestaurant === 'Piedra Negra' ? 'border-pink-500 text-pink-500' : 'border-brand-orange text-brand-orange' 
              : 'border-transparent text-brand-muted hover:text-brand-orange'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Contabilidad & Finanzas
        </button>
      </div>

      {/* Content Render */}
      {activeTab === 'deliveries' ? (
        /* DELIVERIES MANAGEMENT TAB */
        <div className="space-y-6">
          {activeOrders.length === 0 ? (
            <div className="text-center py-20 bg-brand-card/25 rounded-3xl border border-dashed border-brand-border flex flex-col items-center justify-center">
              <Clock className="w-10 h-10 text-brand-muted mb-4" />
              <h3 className="text-lg font-bold text-brand-text mb-1">Sin pedidos activos</h3>
              <p className="text-brand-muted text-xs max-w-xs mx-auto">
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
                    className={`glass-effect rounded-3xl border p-6 flex flex-col justify-between gap-6 transition-all duration-300 bg-white shadow-sm border-brand-border/60 ${
                      selectedRestaurant === 'Piedra Negra' ? 'hover:border-pink-500/30' : 'hover:border-brand-orange/30'
                    }`}
                  >
                    {/* Top Order Meta */}
                    <div className="flex justify-between items-start border-b border-brand-border/40 pb-4 text-left">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-brand-text">{order.id}</span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${label.color}`}>
                            {label.text}
                          </span>
                        </div>
                        <p className="text-[10px] text-brand-muted mt-1">Recibido a las: {order.createdAt}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-brand-muted block uppercase font-bold tracking-wider">TOTAL PEDIDO</span>
                        <span className="text-sm font-black text-brand-orange">S/ {order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Middle: Items & Address details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-xs">
                      {/* Items */}
                      <div className="space-y-1.5 border-r border-brand-border/20 pr-4">
                        <span className="text-[10px] text-brand-muted block uppercase font-bold tracking-wider mb-2">Artículos</span>
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-brand-text truncate max-w-[150px]">
                              <span className="font-extrabold text-brand-orange mr-1">{it.quantity}x</span> {it.name}
                            </span>
                            <span className="text-brand-muted">S/ {(it.price * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery destination */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-muted block uppercase font-bold tracking-wider mb-2">Destino de Entrega</span>
                        {isDelivery ? (
                          <div className="space-y-1">
                            <p className="font-bold text-brand-text flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                              {order.deliveryDetails.faculty}
                            </p>
                            <p className="text-[11px] text-brand-muted">
                              Piso: <span className="text-brand-text font-semibold">{order.deliveryDetails.floor}</span> | Aula/Ofi: <span className="text-brand-text font-semibold">{order.deliveryDetails.classroom}</span>
                            </p>
                            {order.deliveryDetails.notes && (
                              <p className="text-[10px] text-brand-muted italic mt-1 bg-brand-dark/45 p-1 rounded border border-brand-border/40">
                                "{order.deliveryDetails.notes}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="font-bold text-green-600 flex items-center gap-1">
                              <Store className="w-3.5 h-3.5 shrink-0" />
                              Retiro en Local
                            </p>
                            <p className="text-[11px] text-brand-muted">
                              El cliente se acercará al mostrador del local para retirar.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Status controllers & QR validate */}
                    <div className="bg-brand-dark/40 border border-brand-border/40 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                      {/* Step Controller */}
                      <div className="flex gap-2">
                        {order.status === 0 && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 1)}
                            className="bg-brand-card hover:bg-brand-dark/20 text-[10px] font-bold text-brand-text border border-brand-border px-3.5 py-2 rounded-xl transition-all"
                          >
                            Empezar Cocción
                          </button>
                        )}
                        {order.status === 1 && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 2)}
                            className="bg-brand-orange hover:bg-brand-orange/90 text-[10px] font-bold text-white px-3.5 py-2 rounded-xl transition-all shadow-sm"
                          >
                            Listo para Despacho
                          </button>
                        )}
                        {order.status === 2 && (
                          <span className="text-[10px] text-brand-muted flex items-center gap-1.5 py-1.5 px-3 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-brand-orange animate-spin" style={{ animationDuration: '4s' }} />
                            Esperando repartidor / confirmación
                          </span>
                        )}
                        {order.status === 3 && (
                          <span className="text-[10px] text-green-600 flex items-center gap-1.5 py-1.5 px-3 font-bold bg-green-500/10 border border-green-500/20 rounded-xl">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completado
                          </span>
                        )}
                      </div>

                      {/* QR Validation Scanner simulation */}
                      {order.status < 3 ? (
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Validar entrega para el pedido ${order.id} mediante escaneo de código QR?`)) {
                              onUpdateOrderStatus(order.id, 3);
                            }
                          }}
                          className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-[10px] font-bold transition-all text-white ${
                            selectedRestaurant === 'Piedra Negra'
                              ? 'bg-pink-600 hover:bg-pink-500'
                              : 'bg-brand-orange hover:bg-brand-orange/90 shadow-md shadow-brand-orange/15'
                          }`}
                        >
                          <QrCode className="w-4 h-4" />
                          Escanear QR
                        </button>
                      ) : (
                        <span className="text-[9px] text-brand-muted font-bold tracking-widest uppercase">PAGO REGISTRADO</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ACCOUNTING & FINANCE TAB */
        <div className="space-y-8 text-left">
          
          {/* Top Finance Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-effect rounded-3xl p-6 bg-white border border-brand-border/60">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Ventas Totales</span>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-black text-brand-text mt-3">S/ {totalSales.toFixed(2)}</p>
              <p className="text-[10px] text-green-500 font-bold mt-1.5 flex items-center gap-1">
                <span>+12.4%</span> vs semana anterior
              </p>
            </div>

            <div className="glass-effect rounded-3xl p-6 bg-white border border-brand-border/60">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Gastos de Operación</span>
                <TrendingDown className="w-5 h-5 text-brand-red" />
              </div>
              <p className="text-2xl font-black text-brand-text mt-3">S/ {totalExpenses.toFixed(2)}</p>
              <p className="text-[10px] text-brand-muted mt-1.5">Materia prima e insumos UIDE</p>
            </div>

            <div className="glass-effect rounded-3xl p-6 bg-white border border-brand-border/60">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Ganancia Neta</span>
                <TrendingUp className="w-5 h-5 text-brand-orange" />
              </div>
              <p className={`text-2xl font-black mt-3 ${netEarnings >= 0 ? 'text-brand-text' : 'text-brand-red'}`}>
                S/ {netEarnings.toFixed(2)}
              </p>
              <p className="text-[10px] text-brand-muted mt-1.5">Neto después de deducir gastos</p>
            </div>

            <div className="glass-effect rounded-3xl p-6 bg-white border border-brand-border/60">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Ticket Promedio</span>
                <BarChart3 className="w-5 h-5 text-brand-yellow" />
              </div>
              <p className="text-2xl font-black text-brand-text mt-3">S/ {averageTicket.toFixed(2)}</p>
              <p className="text-[10px] text-brand-muted mt-1.5">Valor medio por pedido</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Sales graph & Expenses log */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Sales by Hour Graphic mockup */}
              <div className="glass-effect rounded-3xl p-6 md:p-8 bg-white border border-brand-border/60">
                <h3 className="text-sm font-extrabold text-brand-text uppercase tracking-wider mb-6">Picos de Demanda por Hora (Campus)</h3>
                
                <div className="h-44 flex items-end justify-between gap-3 border-b border-brand-border/30 pb-2 relative">
                  {chartData.map((data, index) => {
                    const barHeightPercent = (data.sales / 50) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <span className="text-[10px] font-bold text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {data.sales} ped
                        </span>
                        {/* Bar */}
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-1000 ${
                            selectedRestaurant === 'Piedra Negra'
                              ? 'bg-gradient-to-t from-pink-700 to-pink-500 group-hover:from-pink-600 group-hover:to-pink-400'
                              : 'bg-gradient-to-t from-brand-red to-brand-orange group-hover:from-brand-orange group-hover:to-brand-yellow'
                          }`}
                          style={{ height: `${barHeightPercent}%` }}
                        ></div>
                        <span className="text-[10px] text-brand-muted font-bold">{data.hour}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 text-[10px] text-brand-muted mt-4">
                  <span className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-brand-orange" /> Mayor volumen registrado a la hora del almuerzo universitario.</span>
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className="glass-effect rounded-3xl p-6 md:p-8 bg-white border border-brand-border/60">
                <h3 className="text-sm font-extrabold text-brand-text uppercase tracking-wider mb-6">Historial de Transacciones Recientes</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-brand-border text-brand-muted font-bold uppercase">
                        <th className="pb-3">Código</th>
                        <th className="pb-3">Fecha/Hora</th>
                        <th className="pb-3">Método</th>
                        <th className="pb-3 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/40 text-brand-text">
                      {activeOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-brand-dark/25">
                          <td className="py-3 font-bold text-brand-text">{order.id}</td>
                          <td className="py-3 text-brand-muted">{order.createdAt}</td>
                          <td className="py-3">
                            <span className="capitalize">{order.deliveryDetails?.method === 'delivery' ? 'Delivery' : 'Retiro'}</span>
                          </td>
                          <td className="py-3 text-right font-extrabold text-brand-text">S/ {order.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right: Expenses form and list */}
            <div className="space-y-6">
              
              {/* Add Expense Card Form */}
              <div className="glass-effect rounded-3xl p-6 bg-white border border-brand-border/60">
                <h3 className="text-sm font-extrabold text-brand-text uppercase tracking-wider mb-4">Registrar Gasto de Operación</h3>
                
                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Concepto de Gasto</label>
                    <input
                      type="text"
                      placeholder="Ej. Insumos pastelería, envases"
                      value={expenseName}
                      onChange={(e) => setExpenseName(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-border rounded-xl p-3 text-xs text-brand-text focus:outline-none focus:border-brand-orange"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Monto (S/)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-border rounded-xl p-3 text-xs text-brand-text focus:outline-none focus:border-brand-orange"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 text-white transition duration-300 cursor-pointer ${
                      selectedRestaurant === 'Piedra Negra'
                        ? 'bg-pink-600 hover:bg-pink-500'
                        : 'bg-gradient-to-r from-brand-red to-brand-orange hover:opacity-95'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Añadir Gasto
                  </button>
                </form>
              </div>

              {/* Expenses List Ledger */}
              <div className="glass-effect rounded-3xl p-6 bg-white border border-brand-border/60">
                <h3 className="text-sm font-extrabold text-brand-text uppercase tracking-wider mb-4">Registro de Gastos</h3>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {restaurantExpenses.length === 0 ? (
                    <p className="text-xs text-brand-muted py-4">No se han registrado gastos para este local.</p>
                  ) : (
                    restaurantExpenses.map((exp) => (
                      <div key={exp.id} className="flex justify-between items-center p-3 bg-brand-dark/40 border border-brand-border/40 rounded-xl text-xs">
                        <span className="text-brand-text truncate max-w-[130px] font-medium">{exp.name}</span>
                        <span className="text-brand-red font-bold">- S/ {exp.amount.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
