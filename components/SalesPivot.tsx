import React, { useState, useMemo } from 'react';
import { Sale } from '../types';
import { BarChart3, PieChart, ArrowDownUp, DollarSign, Layers } from 'lucide-react';

interface Props {
  sales: Sale[];
}

type GroupByOption = 'product' | 'date' | 'paymentMethod' | 'deliveryMethod' | 'buyerName';

interface GroupedData {
  key: string;
  count: number;
  totalSales: number;
  totalCost: number;
  totalProfit: number;
}

export const SalesPivot: React.FC<Props> = ({ sales }) => {
  const [groupBy, setGroupBy] = useState<GroupByOption>('product');

  const groupedData = useMemo(() => {
    const groups: Record<string, GroupedData> = {};

    sales.forEach(sale => {
      let key = '';
      switch (groupBy) {
        case 'product': key = sale.product; break;
        case 'date': key = sale.date; break;
        case 'paymentMethod': key = sale.paymentMethod; break;
        case 'deliveryMethod': key = sale.deliveryMethod; break;
        case 'buyerName': key = sale.buyerName; break;
      }

      if (!groups[key]) {
        groups[key] = { key, count: 0, totalSales: 0, totalCost: 0, totalProfit: 0 };
      }

      groups[key].count += 1;
      groups[key].totalSales += sale.price;
      groups[key].totalCost += sale.cost;
      groups[key].totalProfit += sale.profit;
    });

    return Object.values(groups).sort((a, b) => b.totalSales - a.totalSales);
  }, [sales, groupBy]);

  const maxSales = Math.max(...groupedData.map(d => d.totalSales));

  const getLabel = (option: GroupByOption) => {
    switch (option) {
      case 'product': return 'Producto';
      case 'date': return 'Fecha';
      case 'paymentMethod': return 'Medio de Pago';
      case 'deliveryMethod': return 'Método de Entrega';
      case 'buyerName': return 'Cliente';
      default: return '';
    }
  };

  if (sales.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed">
        No hay datos para generar el reporte.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 overflow-x-auto">
        <div className="flex items-center gap-2 text-slate-700 font-medium whitespace-nowrap">
          <Layers size={20} className="text-indigo-600" />
          <span>Agrupar por:</span>
        </div>
        <div className="flex gap-2">
          {(['product', 'date', 'paymentMethod', 'buyerName'] as GroupByOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setGroupBy(option)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                groupBy === option 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {getLabel(option)}
            </button>
          ))}
        </div>
      </div>

      {/* Pivot Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="p-4 min-w-[150px]">{getLabel(groupBy)}</th>
                <th className="p-4 text-center">Cant.</th>
                <th className="p-4 text-right">Ventas (S/)</th>
                <th className="p-4 text-right hidden md:table-cell">Costos (S/)</th>
                <th className="p-4 text-right">Utilidad (S/)</th>
                <th className="p-4 w-1/4 hidden lg:table-cell">Distribución</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groupedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{row.key}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                      {row.count}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-slate-800">
                    {row.totalSales.toFixed(2)}
                  </td>
                  <td className="p-4 text-right text-slate-500 hidden md:table-cell">
                    {row.totalCost.toFixed(2)}
                  </td>
                  <td className={`p-4 text-right font-bold ${row.totalProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {row.totalProfit.toFixed(2)}
                  </td>
                  <td className="p-4 hidden lg:table-cell align-middle">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full" 
                        style={{ width: `${(row.totalSales / maxSales) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-bold text-slate-800">
              <tr>
                <td className="p-4">TOTALES</td>
                <td className="p-4 text-center">{groupedData.reduce((a, b) => a + b.count, 0)}</td>
                <td className="p-4 text-right">{groupedData.reduce((a, b) => a + b.totalSales, 0).toFixed(2)}</td>
                <td className="p-4 text-right hidden md:table-cell">{groupedData.reduce((a, b) => a + b.totalCost, 0).toFixed(2)}</td>
                <td className="p-4 text-right text-emerald-700">{groupedData.reduce((a, b) => a + b.totalProfit, 0).toFixed(2)}</td>
                <td className="hidden lg:table-cell"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Visual Summary */}
      <div className="grid md:grid-cols-2 gap-4">
         <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <BarChart3 size={24} />
              </div>
              <h3 className="font-bold text-lg">Top Rendimiento</h3>
            </div>
            <div className="space-y-4">
              {groupedData.slice(0, 3).map((item, i) => (
                <div key={i} className="relative">
                  <div className="flex justify-between text-sm mb-1 font-medium">
                    <span>{item.key}</span>
                    <span>S/ {item.totalSales.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-2">
                    <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${(item.totalSales / maxSales) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
         </div>

         <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-slate-800">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <DollarSign size={24} />
              </div>
              <h3 className="font-bold text-lg">Rentabilidad ({getLabel(groupBy)})</h3>
            </div>
            <div className="space-y-3">
               {groupedData.slice(0, 3).map((item, i) => {
                 const margin = item.totalSales > 0 ? (item.totalProfit / item.totalSales) * 100 : 0;
                 return (
                   <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">{item.key}</span>
                      <div className="text-right">
                         <div className="text-sm font-bold text-slate-900">{margin.toFixed(1)}%</div>
                         <div className="text-xs text-slate-500">Margen</div>
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>
      </div>
    </div>
  );
};
