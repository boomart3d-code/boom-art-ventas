import React from 'react';
import { SalesSummary } from '../types';
import { DollarSign, TrendingUp, Wallet, ShoppingBag } from 'lucide-react';

interface Props {
  summary: SalesSummary;
}

export const StatsCards: React.FC<Props> = ({ summary }) => {
  const formatCurrency = (val: number) => `S/ ${val.toFixed(2)}`;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 text-indigo-600 mb-2">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <DollarSign size={20} />
          </div>
          <span className="text-sm font-medium text-slate-500">Ventas Totales</span>
        </div>
        <p className="text-2xl font-bold text-slate-800">{formatCurrency(summary.totalSales)}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 text-emerald-600 mb-2">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <TrendingUp size={20} />
          </div>
          <span className="text-sm font-medium text-slate-500">Utilidad Neta</span>
        </div>
        <p className="text-2xl font-bold text-slate-800">{formatCurrency(summary.totalProfit)}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 text-rose-600 mb-2">
          <div className="p-2 bg-rose-50 rounded-lg">
            <Wallet size={20} />
          </div>
          <span className="text-sm font-medium text-slate-500">Costos</span>
        </div>
        <p className="text-2xl font-bold text-slate-800">{formatCurrency(summary.totalCost)}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 text-blue-600 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <ShoppingBag size={20} />
          </div>
          <span className="text-sm font-medium text-slate-500">Transacciones</span>
        </div>
        <p className="text-2xl font-bold text-slate-800">{summary.count}</p>
      </div>
    </div>
  );
};