
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  ShoppingCart,
  Users,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data - in real app, this would come from your backend
  const stats = {
    totalItems: user?.businessType === 'medical' ? 342 : 156,
    lowStock: user?.businessType === 'medical' ? 12 : 8,
    todaySales: user?.businessType === 'medical' ? 2840 : 1650,
    todayProfit: user?.businessType === 'medical' ? 680 : 495,
  };

  const lowStockItems = user?.businessType === 'medical' 
    ? [
        { name: 'Paracetamol 500mg', stock: 8, category: 'Fever Medicine' },
        { name: 'Cough Syrup', stock: 5, category: 'Cough Medicine' },
        { name: 'Vitamin D3', stock: 3, category: 'Vitamins' },
      ]
    : [
        { name: 'Vanilla Cornetto', stock: 12, category: 'Cornetto' },
        { name: 'Chocolate Bar', stock: 6, category: 'Bar' },
        { name: 'Strawberry Cup', stock: 9, category: 'Cup' },
      ];

  const recentSales = user?.businessType === 'medical'
    ? [
        { item: 'Paracetamol 500mg', quantity: 5, amount: 25, time: '2 hours ago' },
        { item: 'Cough Syrup', quantity: 2, amount: 36, time: '3 hours ago' },
        { item: 'Antiseptic', quantity: 1, amount: 15, time: '4 hours ago' },
      ]
    : [
        { item: 'Vanilla Cornetto', quantity: 8, amount: 40, time: '1 hour ago' },
        { item: 'Chocolate Bar', quantity: 12, amount: 60, time: '2 hours ago' },
        { item: 'Mango Cup', quantity: 6, amount: 30, time: '3 hours ago' },
      ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name}! Here's what's happening with your{' '}
            {user?.businessType === 'medical' ? 'pharmacy' : 'ice cream business'} today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
              <p className="text-xs text-muted-foreground">in inventory</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
              <p className="text-xs text-muted-foreground">items need restock</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.todaySales}</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${stats.todayProfit}</div>
              <p className="text-xs text-muted-foreground">+8% from yesterday</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Low Stock Alert
              </CardTitle>
              <CardDescription>
                Items that need immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      {item.stock} left
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Recent Sales
              </CardTitle>
              <CardDescription>
                Latest transactions from your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSales.map((sale, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{sale.item}</p>
                      <p className="text-xs text-gray-500">Qty: {sale.quantity} • {sale.time}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      ${sale.amount}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
