import React from 'react';
import { Sale } from '../types';
import { Edit2, Trash2, Calendar, User, CreditCard, Truck, SearchX } from 'lucide-react';

interface Props {
  sales: Sale[];
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
}

export const SalesList: React.FC<Props> = ({ sales, onEdit, onDelete }) => {
  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-slate-300">
        <div className="p-4 bg-slate-50 rounded-full text-slate-300 mb-4">
          <SearchX size={40} />
        </div>
        <h3 className="text-slate-900 font-medium text-lg">No hay ventas registradas</h3>
        <p className="text-slate-500 text-sm mt-1">Intenta cambiar los filtros o agrega una nueva venta.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Fecha</th>
              <th className="p-4 font-semibold text-slate-600">Cliente</th>
              <th className="p-4 font-semibold text-slate-600">Producto</th>
              <th className="p-4 font-semibold text-slate-600">Pago</th>
              <th className="p-4 font-semibold text-slate-600">Entrega</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Precio</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Utilidad</th>
              <th className="p-4 font-semibold text-slate-600 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sales.map(sale => (
              <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-slate-600 whitespace-nowrap">{sale.date}</td>
                <td className="p-4">
                  <div className="font-medium text-slate-800">{sale.buyerName}</div>
                  <div className="text-xs text-slate-400">{sale.buyerPhone}</div>
                </td>
                <td className="p-4 text-slate-700">{sale.product}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-600">
                    {sale.paymentMethod}
                  </span>
                </td>
                <td className="p-4 text-slate-600 text-xs">{sale.deliveryMethod}</td>
                <td className="p-4 text-right font-medium text-slate-800">S/ {sale.price.toFixed(2)}</td>
                <td className={`p-4 text-right font-medium ${sale.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  S/ {sale.profit.toFixed(2)}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(sale)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(sale.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors" title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-100">
        {sales.map(sale => (
          <div key={sale.id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-800">{sale.product}</h3>
                <p className="text-sm text-slate-500">{sale.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">S/ {sale.price.toFixed(2)}</p>
                <p className={`text-xs font-medium ${sale.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  Util: {sale.profit.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User size={14} />
              <span>{sale.buyerName}</span>
              {sale.buyerPhone && <span className="text-slate-400">({sale.buyerPhone})</span>}
            </div>

            <div className="flex gap-2">
               <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-xs text-slate-600">
                 <CreditCard size={12} /> {sale.paymentMethod}
               </span>
               <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-xs text-slate-600">
                 <Truck size={12} /> {sale.deliveryMethod}
               </span>
            </div>

            <div className="flex justify-end gap-3 mt-2 pt-2 border-t border-slate-50">
              <button onClick={() => onEdit(sale)} className="text-sm text-indigo-600 font-medium px-2 py-1">Editar</button>
              <button onClick={() => onDelete(sale.id)} className="text-sm text-rose-500 font-medium px-2 py-1">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
