import React, { useState, useEffect, useMemo } from 'react';
import { Login } from './components/Login';
import { SaleForm } from './components/SaleForm';
import { SalesList } from './components/SalesList';
import { SalesPivot } from './components/SalesPivot';
import { StatsCards } from './components/StatsCards';
import { AiChat } from './components/AiChat';
import { Sale, User, SalesSummary, PaymentMethod } from './types';
import { getSales, saveSale, deleteSale } from './services/storageService';
import { Plus, LogOut, Download, Filter, FileSpreadsheet, Check, LayoutList, PieChart } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [showToast, setShowToast] = useState(false);
  
  // View State: 'list' or 'report'
  const [viewMode, setViewMode] = useState<'list' | 'report'>('list');

  // Filters
  const [monthFilter, setMonthFilter] = useState<string>(new Date().toISOString().slice(0, 7));
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  useEffect(() => {
    const loadedSales = getSales();
    setSales(loadedSales);
    
    // Check session storage for persisted login
    const savedUser = sessionStorage.getItem('boom_art_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    sessionStorage.setItem('boom_art_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('boom_art_user');
  };

  const handleSaveSale = (sale: Sale) => {
    const updatedSales = saveSale(sale);
    setSales(updatedSales);
    setEditingSale(null);
  };

  const handleDeleteSale = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      const updatedSales = deleteSale(id);
      setSales(updatedSales);
    }
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setIsFormOpen(true);
  };

  // Filter Data
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const matchMonth = s.date.startsWith(monthFilter);
      const matchPayment = paymentFilter === 'all' || s.paymentMethod === paymentFilter;
      return matchMonth && matchPayment;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sales, monthFilter, paymentFilter]);

  // Calculate Stats
  const summary: SalesSummary = useMemo(() => {
    return filteredSales.reduce((acc, curr) => ({
      totalSales: acc.totalSales + curr.price,
      totalCost: acc.totalCost + curr.cost,
      totalProfit: acc.totalProfit + curr.profit,
      count: acc.count + 1
    }), { totalSales: 0, totalCost: 0, totalProfit: 0, count: 0 });
  }, [filteredSales]);

  const exportCSV = () => {
    const headers = ['ID,Fecha,Cliente,Teléfono,Producto,Costo,Precio,Utilidad,Pago,Entrega,Notas'];
    const rows = filteredSales.map(s => 
      `"${s.id}","${s.date}","${s.buyerName}","${s.buyerPhone}","${s.product}",${s.cost},${s.price},${s.profit},"${s.paymentMethod}","${s.deliveryMethod}","${s.notes?.replace(/"/g, '""') || ''}"`
    );
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `boom_art_ventas_${monthFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    const headers = ['Fecha', 'Cliente', 'Teléfono', 'Producto', 'Costo', 'Precio', 'Utilidad', 'Pago', 'Entrega', 'Notas'];
    const rows = filteredSales.map(s => 
      `${s.date}\t${s.buyerName}\t${s.buyerPhone}\t${s.product}\t${s.cost.toFixed(2)}\t${s.price.toFixed(2)}\t${s.profit.toFixed(2)}\t${s.paymentMethod}\t${s.deliveryMethod}\t${s.notes?.replace(/\n/g, ' ') || ''}`
    );
    const tsvContent = [headers.join('\t'), ...rows].join('\n');
    
    try {
      await navigator.clipboard.writeText(tsvContent);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
      alert('No se pudo copiar al portapapeles');
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-10">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">BA</div>
              <span className="text-lg font-bold text-slate-800 hidden sm:block">Boom Art Sales</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 hidden sm:block">Hola, <b>{user.name}</b></span>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Salir">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggles & Controls */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            {/* Left: Filters */}
            <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-full xl:w-auto">
              <div className="flex items-center px-3 gap-2 text-slate-500 border-r border-slate-100">
                <Filter size={16} />
                <span className="text-sm font-medium">Filtros</span>
              </div>
              <input 
                type="month" 
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="text-sm border-none bg-transparent focus:ring-0 text-slate-700 cursor-pointer outline-none"
              />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="text-sm border-none bg-transparent focus:ring-0 text-slate-700 cursor-pointer outline-none"
              >
                <option value="all">Todos los pagos</option>
                {Object.values(PaymentMethod).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Center: View Switcher */}
            <div className="bg-slate-200 p-1 rounded-xl flex gap-1 w-full xl:w-auto">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <LayoutList size={16} />
                Lista
              </button>
              <button
                onClick={() => setViewMode('report')}
                className={`flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'report' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <PieChart size={16} />
                Reporte
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap gap-3 w-full xl:w-auto">
              <button 
                onClick={copyToClipboard}
                className="flex-1 xl:flex-none items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors text-sm font-medium shadow-sm flex group"
                title="Copiar para pegar en Google Sheets"
              >
                <FileSpreadsheet size={18} className="text-emerald-600" />
                <span className="whitespace-nowrap hidden lg:inline">Copiar a Sheets</span>
                <span className="lg:hidden">Copiar</span>
              </button>

              <button 
                onClick={exportCSV}
                className="flex-1 xl:flex-none items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm flex"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              
              <button 
                onClick={() => { setEditingSale(null); setIsFormOpen(true); }}
                className="flex-1 xl:flex-none items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95 text-sm font-medium shadow-lg shadow-slate-200 flex whitespace-nowrap"
              >
                <Plus size={18} />
                Nueva Venta
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsCards summary={summary} />

        {/* Main Content Area */}
        {viewMode === 'list' ? (
          <SalesList 
            sales={filteredSales} 
            onEdit={handleEditSale} 
            onDelete={handleDeleteSale}
          />
        ) : (
          <SalesPivot sales={filteredSales} />
        )}
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 z-50">
          <div className="bg-emerald-500 rounded-full p-1">
            <Check size={14} strokeWidth={3} />
          </div>
          <span className="font-medium text-sm">¡Copiado! Listo para pegar en Google Sheets</span>
        </div>
      )}

      {/* Modals & Overlays */}
      <SaleForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveSale}
        initialData={editingSale}
      />

      {/* AI Chatbot */}
      <AiChat salesData={filteredSales} />
    </div>
  );
}

export default App;
