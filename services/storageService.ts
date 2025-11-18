import { Sale } from '../types';

const STORAGE_KEY = 'boom_art_sales_data';

export const getSales = (): Sale[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading sales", error);
    return [];
  }
};

export const saveSale = (sale: Sale): Sale[] => {
  const sales = getSales();
  const existingIndex = sales.findIndex(s => s.id === sale.id);
  
  let newSales;
  if (existingIndex >= 0) {
    newSales = [...sales];
    newSales[existingIndex] = sale;
  } else {
    newSales = [sale, ...sales]; // Add to top
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newSales));
  return newSales;
};

export const deleteSale = (id: string): Sale[] => {
  const sales = getSales();
  const newSales = sales.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newSales));
  return newSales;
};

export const getUniqueCustomers = (): string[] => {
  const sales = getSales();
  const names = new Set(sales.map(s => s.buyerName));
  return Array.from(names);
};