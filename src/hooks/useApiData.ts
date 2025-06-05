
import { useState, useEffect } from 'react';
import { mockApi, MockInventoryItem, MockVendor, MockSalesTransaction } from '@/services/mockApi';

// Custom hook for fetching inventory data
export const useInventory = () => {
  const [inventory, setInventory] = useState<MockInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await mockApi.getInventory();
        setInventory(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch inventory');
        console.error('Error fetching inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return { inventory, loading, error, refetch: () => window.location.reload() };
};

// Custom hook for fetching vendors data
export const useVendors = () => {
  const [vendors, setVendors] = useState<MockVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const data = await mockApi.getVendors();
        setVendors(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch vendors');
        console.error('Error fetching vendors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const addVendor = async (vendorData: any) => {
    try {
      const newVendor = await mockApi.createVendor(vendorData);
      setVendors(prev => [...prev, newVendor]);
      return newVendor;
    } catch (err) {
      setError('Failed to create vendor');
      throw err;
    }
  };

  const updateVendor = async (id: string, vendorData: any) => {
    try {
      const updatedVendor = await mockApi.updateVendor(id, vendorData);
      setVendors(prev => prev.map(v => v.id === id ? updatedVendor : v));
      return updatedVendor;
    } catch (err) {
      setError('Failed to update vendor');
      throw err;
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      await mockApi.deleteVendor(id);
      setVendors(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError('Failed to delete vendor');
      throw err;
    }
  };

  return { 
    vendors, 
    loading, 
    error, 
    addVendor, 
    updateVendor, 
    deleteVendor,
    refetch: () => window.location.reload()
  };
};

// Custom hook for sales transactions
export const useSalesTransactions = () => {
  const [transactions, setTransactions] = useState<MockSalesTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await mockApi.getSalesTransactions();
        setTransactions(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch sales transactions');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const recordSales = async (salesData: any) => {
    try {
      const newTransaction = await mockApi.recordDailySales(salesData);
      setTransactions(prev => [...prev, newTransaction]);
      return newTransaction;
    } catch (err) {
      setError('Failed to record sales');
      throw err;
    }
  };

  return { 
    transactions, 
    loading, 
    error, 
    recordSales,
    refetch: () => window.location.reload()
  };
};

// Custom hook for dashboard stats
export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalVendors: 0,
    totalProducts: 0,
    lowStockItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await mockApi.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard stats');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => window.location.reload() };
};
