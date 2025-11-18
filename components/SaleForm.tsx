import React, { useState, useEffect } from 'react';
import { Sale, PaymentMethod, DeliveryMethod } from '../types';
import { X, Save } from 'lucide-react';
import { getUniqueCustomers } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Sale) => void;
  initialData?: Sale | null;
}

export const SaleForm: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Sale>>({
    date: new Date().toISOString().split('T')[0],
    paymentMethod: PaymentMethod.EFECTIVO,
    deliveryMethod: DeliveryMethod.RECOJO,
  });

  const [prevCustomers, setPrevCustomers] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPrevCustomers(getUniqueCustomers());
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          paymentMethod: PaymentMethod.EFECTIVO,
          deliveryMethod: DeliveryMethod.RECOJO,
          buyerName: '',
          buyerPhone: '',
          product: '',
          cost: 0,
          price: 0,
          notes: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate profit when cost or price changes
      if (name === 'cost' || name === 'price') {
        const cost = name === 'cost' ? parseFloat(value) || 0 : parseFloat(String(prev.cost)) || 0;
        const price = name === 'price' ? parseFloat(value) || 0 : parseFloat(String(prev.price)) || 0;
        updated.profit = price - cost;
      }
      
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.buyerName || !formData.product || !formData.price) return;
    if (formData.buyerPhone && !/^\d{9}$/.test(formData.buyerPhone)) {
      alert("El teléfono debe tener 9 dígitos");
      return;
    }

    const saleToSave: Sale = {
      id: formData.id || crypto.randomUUID(),
      timestamp: formData.timestamp || Date.now(),
      date: formData.date!,
      buyerName: formData.buyerName!,
      buyerPhone: formData.buyerPhone || '',
      product: formData.product!,
      cost: Number(formData.cost) || 0,
      price: Number(formData.price) || 0,
      profit: (Number(formData.price) || 0) - (Number(formData.cost) || 0),
      paymentMethod: formData.paymentMethod as PaymentMethod,
      deliveryMethod: formData.deliveryMethod as DeliveryMethod,
      notes: formData.notes || ''
    };

    onSave(saleToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Editar Venta' : 'Nueva Venta'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input
                type="tel"
                name="buyerPhone"
                value={formData.buyerPhone}
                onChange={handleChange}
                placeholder="999999999"
                maxLength={9}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
            <input
              type="text"
              name="buyerName"
              value={formData.buyerName}
              onChange={handleChange}
              list="customer-list"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
              autoComplete="off"
            />
            <datalist id="customer-list">
              {prevCustomers.map((name, i) => <option key={i} value={name} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Producto</label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Costo (S/)</label>
              <input
                type="number"
                step="0.10"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Precio (S/)</label>
              <input
                type="number"
                step="0.10"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Utilidad</label>
              <div className={`w-full p-2 border rounded-lg bg-slate-50 font-bold ${((formData.price || 0) - (formData.cost || 0)) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {((formData.price || 0) - (formData.cost || 0)).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Medio de Pago</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {Object.values(PaymentMethod).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Entrega</label>
              <select
                name="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {Object.values(DeliveryMethod).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notas (Opcional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-200"
            >
              <Save size={20} />
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};