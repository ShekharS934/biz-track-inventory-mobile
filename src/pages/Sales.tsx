
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  DollarSign, 
  TrendingUp, 
  Package,
  Clock,
  ShoppingCart
} from 'lucide-react';

interface Sale {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  profit: number;
  timestamp: Date;
  soldBy: string;
}

const Sales = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Mock sales data
  const sales: Sale[] = user?.businessType === 'medical' ? [
    {
      id: '1',
      itemName: 'Paracetamol 500mg',
      category: 'Fever Medicine',
      quantity: 5,
      unitPrice: 8.50,
      totalAmount: 42.50,
      profit: 17.50,
      timestamp: new Date(2024, 5, 2, 10, 30),
      soldBy: 'John Doe'
    },
    {
      id: '2',
      itemName: 'Cough Syrup',
      category: 'Cough Medicine',
      quantity: 2,
      unitPrice: 18.00,
      totalAmount: 36.00,
      profit: 12.00,
      timestamp: new Date(2024, 5, 2, 11, 15),
      soldBy: 'Jane Smith'
    },
    {
      id: '3',
      itemName: 'Antiseptic Solution',
      category: 'First Aid',
      quantity: 1,
      unitPrice: 15.00,
      totalAmount: 15.00,
      profit: 6.00,
      timestamp: new Date(2024, 5, 2, 14, 20),
      soldBy: 'John Doe'
    },
    {
      id: '4',
      itemName: 'Vitamin D3',
      category: 'Vitamins',
      quantity: 3,
      unitPrice: 25.00,
      totalAmount: 75.00,
      profit: 21.00,
      timestamp: new Date(2024, 5, 2, 16, 45),
      soldBy: 'Jane Smith'
    },
  ] : [
    {
      id: '1',
      itemName: 'Vanilla Cornetto',
      category: 'Cornetto',
      quantity: 8,
      unitPrice: 3.50,
      totalAmount: 28.00,
      profit: 12.00,
      timestamp: new Date(2024, 5, 2, 9, 30),
      soldBy: 'Mike Johnson'
    },
    {
      id: '2',
      itemName: 'Chocolate Bar',
      category: 'Bar',
      quantity: 12,
      unitPrice: 4.00,
      totalAmount: 48.00,
      profit: 18.00,
      timestamp: new Date(2024, 5, 2, 12, 15),
      soldBy: 'Sarah Wilson'
    },
    {
      id: '3',
      itemName: 'Strawberry Cup',
      category: 'Cup',
      quantity: 6,
      unitPrice: 3.00,
      totalAmount: 18.00,
      profit: 7.20,
      timestamp: new Date(2024, 5, 2, 14, 30),
      soldBy: 'Mike Johnson'
    },
    {
      id: '4',
      itemName: 'Mango Kulfi',
      category: 'Kulfi',
      quantity: 4,
      unitPrice: 2.50,
      totalAmount: 10.00,
      profit: 4.00,
      timestamp: new Date(2024, 5, 2, 16, 0),
      soldBy: 'Sarah Wilson'
    },
  ];

  // Calculate today's totals
  const todaysSales = sales.filter(sale => 
    sale.timestamp.toDateString() === selectedDate.toDateString()
  );

  const totalSales = todaysSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalProfit = todaysSales.reduce((sum, sale) => sum + sale.profit, 0);
  const totalItems = todaysSales.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalTransactions = todaysSales.length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
            <p className="text-gray-600 mt-1">Track your daily sales and profit</p>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">for {format(selectedDate, "MMM d, yyyy")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${totalProfit.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {totalSales > 0 ? `${((totalProfit / totalSales) * 100).toFixed(1)}% margin` : '0% margin'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
              <Package className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalItems}</div>
              <p className="text-xs text-muted-foreground">units sold</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <ShoppingCart className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">completed sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Sales for {format(selectedDate, "MMMM d, yyyy")}
            </CardTitle>
            <CardDescription>
              Detailed breakdown of all sales transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todaysSales.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No sales recorded for this date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaysSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{sale.itemName}</h3>
                        <Badge variant="outline">{sale.category}</Badge>
                        <span className="text-sm text-gray-500">
                          {format(sale.timestamp, "h:mm a")}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Sold by: {sale.soldBy} • Quantity: {sale.quantity} units
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">${sale.totalAmount.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        Profit: ${sale.profit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Sales;
