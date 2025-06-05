
// Mock API service to simulate Flask backend endpoints
export interface MockInventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  cost: number;
  lowStockThreshold: number;
  description: string;
}

export interface MockVendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  commissionRate: number;
  totalSales: number;
  monthlyCommission: number;
  joinDate: string;
  status: 'active' | 'inactive';
  products: string[];
}

export interface MockSalesTransaction {
  id: string;
  vendorId: string;
  vendorName: string;
  date: string;
  itemsData: {
    itemId: string;
    itemName: string;
    unitPrice: number;
    unitCost: number;
    quantityTaken: number;
    quantityReturned: number;
    quantitySold: number;
  }[];
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  vendorCommission: number;
  netProfit: number;
}

// Mock data
const mockInventory: MockInventoryItem[] = [
  {
    id: '1',
    name: 'Vanilla Cornetto',
    category: 'Cornetto',
    stock: 45,
    price: 3.50,
    cost: 2.00,
    lowStockThreshold: 20,
    description: 'Creamy vanilla ice cream cone'
  },
  {
    id: '2',
    name: 'Chocolate Bar',
    category: 'Bar',
    stock: 12,
    price: 4.00,
    cost: 2.50,
    lowStockThreshold: 25,
    description: 'Rich chocolate ice cream bar'
  },
  {
    id: '3',
    name: 'Strawberry Cup',
    category: 'Cup',
    stock: 28,
    price: 3.00,
    cost: 1.80,
    lowStockThreshold: 15,
    description: 'Fresh strawberry ice cream cup'
  },
  {
    id: '4',
    name: 'Mango Kulfi',
    category: 'Kulfi',
    stock: 8,
    price: 2.50,
    cost: 1.50,
    lowStockThreshold: 20,
    description: 'Traditional mango kulfi'
  }
];

const mockVendors: MockVendor[] = [
  {
    id: '1',
    name: 'Sweet Scoops Supply',
    email: 'contact@sweetscoops.com',
    phone: '+1 (555) 123-4567',
    commissionRate: 8.5,
    totalSales: 12450,
    monthlyCommission: 1058.25,
    joinDate: '2024-01-15',
    status: 'active',
    products: ['Vanilla Cornetto', 'Chocolate Bar', 'Strawberry Cup']
  },
  {
    id: '2',
    name: 'Frozen Delights Inc',
    email: 'sales@frozendelights.com',
    phone: '+1 (555) 987-6543',
    commissionRate: 7.0,
    totalSales: 8920,
    monthlyCommission: 624.40,
    joinDate: '2024-02-20',
    status: 'active',
    products: ['Chocolate Bar', 'Mango Kulfi']
  },
  {
    id: '3',
    name: 'Cone Corner',
    email: 'info@conecorner.com',
    phone: '+1 (555) 456-7890',
    commissionRate: 6.5,
    totalSales: 3450,
    monthlyCommission: 224.25,
    joinDate: '2024-03-10',
    status: 'inactive',
    products: ['Vanilla Cornetto', 'Strawberry Cup']
  }
];

const mockSalesTransactions: MockSalesTransaction[] = [
  {
    id: '1',
    vendorId: '1',
    vendorName: 'Sweet Scoops Supply',
    date: '2024-06-05',
    itemsData: [
      {
        itemId: '1',
        itemName: 'Vanilla Cornetto',
        unitPrice: 3.50,
        unitCost: 2.00,
        quantityTaken: 20,
        quantityReturned: 2,
        quantitySold: 18
      },
      {
        itemId: '2',
        itemName: 'Chocolate Bar',
        unitPrice: 4.00,
        unitCost: 2.50,
        quantityTaken: 15,
        quantityReturned: 1,
        quantitySold: 14
      }
    ],
    totalRevenue: 119.00,
    totalCost: 71.00,
    grossProfit: 48.00,
    vendorCommission: 10.12,
    netProfit: 37.88
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API endpoints
export const mockApi = {
  // Inventory endpoints
  async getInventory(): Promise<MockInventoryItem[]> {
    await delay(500);
    console.log('Mock API: GET /api/inventory');
    return mockInventory;
  },

  async getInventoryItem(id: string): Promise<MockInventoryItem | null> {
    await delay(300);
    console.log(`Mock API: GET /api/inventory/${id}`);
    return mockInventory.find(item => item.id === id) || null;
  },

  async updateInventoryStock(id: string, newStock: number): Promise<MockInventoryItem> {
    await delay(400);
    console.log(`Mock API: PUT /api/inventory/${id}/stock`, { stock: newStock });
    const item = mockInventory.find(item => item.id === id);
    if (item) {
      item.stock = newStock;
    }
    return item!;
  },

  // Vendor endpoints
  async getVendors(): Promise<MockVendor[]> {
    await delay(600);
    console.log('Mock API: GET /api/vendors');
    return mockVendors;
  },

  async getVendor(id: string): Promise<MockVendor | null> {
    await delay(300);
    console.log(`Mock API: GET /api/vendors/${id}`);
    return mockVendors.find(vendor => vendor.id === id) || null;
  },

  async createVendor(vendorData: Omit<MockVendor, 'id' | 'totalSales' | 'monthlyCommission' | 'joinDate'>): Promise<MockVendor> {
    await delay(700);
    console.log('Mock API: POST /api/vendors', vendorData);
    const newVendor: MockVendor = {
      ...vendorData,
      id: Date.now().toString(),
      totalSales: 0,
      monthlyCommission: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };
    mockVendors.push(newVendor);
    return newVendor;
  },

  async updateVendor(id: string, vendorData: Partial<MockVendor>): Promise<MockVendor> {
    await delay(500);
    console.log(`Mock API: PUT /api/vendors/${id}`, vendorData);
    const vendorIndex = mockVendors.findIndex(vendor => vendor.id === id);
    if (vendorIndex !== -1) {
      mockVendors[vendorIndex] = { ...mockVendors[vendorIndex], ...vendorData };
      return mockVendors[vendorIndex];
    }
    throw new Error('Vendor not found');
  },

  async deleteVendor(id: string): Promise<void> {
    await delay(400);
    console.log(`Mock API: DELETE /api/vendors/${id}`);
    const vendorIndex = mockVendors.findIndex(vendor => vendor.id === id);
    if (vendorIndex !== -1) {
      mockVendors.splice(vendorIndex, 1);
    }
  },

  // Sales endpoints
  async getSalesTransactions(startDate?: string, endDate?: string): Promise<MockSalesTransaction[]> {
    await delay(800);
    console.log('Mock API: GET /api/sales', { startDate, endDate });
    return mockSalesTransactions;
  },

  async recordDailySales(salesData: Omit<MockSalesTransaction, 'id'>): Promise<MockSalesTransaction> {
    await delay(900);
    console.log('Mock API: POST /api/sales/daily', salesData);
    const newTransaction: MockSalesTransaction = {
      ...salesData,
      id: Date.now().toString()
    };
    mockSalesTransactions.push(newTransaction);
    return newTransaction;
  },

  async getDailySalesReport(date: string): Promise<MockSalesTransaction[]> {
    await delay(500);
    console.log(`Mock API: GET /api/sales/daily/${date}`);
    return mockSalesTransactions.filter(transaction => transaction.date === date);
  },

  async getVendorSales(vendorId: string, startDate?: string, endDate?: string): Promise<MockSalesTransaction[]> {
    await delay(600);
    console.log(`Mock API: GET /api/vendors/${vendorId}/sales`, { startDate, endDate });
    return mockSalesTransactions.filter(transaction => transaction.vendorId === vendorId);
  },

  // Dashboard stats endpoints
  async getDashboardStats(): Promise<{
    totalRevenue: number;
    totalProfit: number;
    totalVendors: number;
    totalProducts: number;
    lowStockItems: number;
  }> {
    await delay(400);
    console.log('Mock API: GET /api/dashboard/stats');
    
    const totalRevenue = mockSalesTransactions.reduce((sum, t) => sum + t.totalRevenue, 0);
    const totalProfit = mockSalesTransactions.reduce((sum, t) => sum + t.netProfit, 0);
    const totalVendors = mockVendors.filter(v => v.status === 'active').length;
    const totalProducts = mockInventory.length;
    const lowStockItems = mockInventory.filter(item => item.stock <= item.lowStockThreshold).length;

    return {
      totalRevenue,
      totalProfit,
      totalVendors,
      totalProducts,
      lowStockItems
    };
  }
};
