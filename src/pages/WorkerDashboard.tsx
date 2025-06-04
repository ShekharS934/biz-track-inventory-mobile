
import React from 'react';
import Layout from '@/components/Layout';
import WorkerSalesForm from '@/components/WorkerSalesForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  Package, 
  TrendingUp,
  Clock
} from 'lucide-react';

const WorkerDashboard = () => {
  // Mock data for today's stats
  const todayStats = {
    totalSales: 245.50,
    itemsSold: 32,
    vendorsServed: 3,
    profit: 89.75
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Worker Dashboard</h1>
          <p className="text-gray-600 mt-1">Record daily sales and track performance</p>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${todayStats.totalSales}</div>
              <p className="text-xs text-muted-foreground">recorded so far</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{todayStats.itemsSold}</div>
              <p className="text-xs text-muted-foreground">units total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendors Served</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{todayStats.vendorsServed}</div>
              <p className="text-xs text-muted-foreground">today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Generated</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">${todayStats.profit}</div>
              <p className="text-xs text-muted-foreground">net profit</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Recording Form */}
        <WorkerSalesForm />
      </div>
    </Layout>
  );
};

export default WorkerDashboard;
