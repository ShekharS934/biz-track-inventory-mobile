
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Mail, 
  Phone, 
  DollarSign,
  TrendingUp,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';

const Vendors = () => {
  // Mock vendor data for ice cream business
  const [vendors] = useState([
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
      products: ['Vanilla Cones', 'Chocolate Bars', 'Strawberry Cups']
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
      products: ['Premium Ice Cream', 'Gelato', 'Sorbets']
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
      products: ['Waffle Cones', 'Sugar Cones']
    }
  ]);

  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const totalCommission = vendors.reduce((sum, v) => sum + v.monthlyCommission, 0);
  const avgCommissionRate = vendors.reduce((sum, v) => sum + v.commissionRate, 0) / vendors.length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
            <p className="text-gray-600 mt-1">
              Manage your ice cream supply vendors and their commission rates
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Vendor
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendors.length}</div>
              <p className="text-xs text-muted-foreground">{activeVendors} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Commissions</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalCommission.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Commission Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{avgCommissionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">across all vendors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{activeVendors}</div>
              <p className="text-xs text-muted-foreground">currently supplying</p>
            </CardContent>
          </Card>
        </div>

        {/* Vendors List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {vendor.name}
                      <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                        {vendor.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Member since {new Date(vendor.joinDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      {vendor.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {vendor.phone}
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Commission Rate</p>
                      <p className="font-semibold text-green-600">{vendor.commissionRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Monthly Commission</p>
                      <p className="font-semibold">${vendor.monthlyCommission.toFixed(2)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Total Sales</p>
                      <p className="font-semibold">${vendor.totalSales.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Products */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Products Supplied</p>
                    <div className="flex flex-wrap gap-1">
                      {vendor.products.map((product, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Vendors;
