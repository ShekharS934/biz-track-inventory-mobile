
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import VendorFormDialog from '@/components/VendorFormDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Plus, 
  Mail, 
  Phone, 
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  Building2,
  Calendar,
  Package
} from 'lucide-react';

interface Vendor {
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

const Vendors = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([
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
      products: ['Vanilla Ice Cream', 'Chocolate Cones', 'Strawberry Cups']
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
      products: ['Premium Gelato', 'Artisan Sorbets', 'Ice Cream Sandwiches']
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
      products: ['Waffle Cones', 'Sugar Cones', 'Chocolate Dipped Cones']
    }
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const totalCommission = vendors.reduce((sum, v) => sum + v.monthlyCommission, 0);
  const avgCommissionRate = vendors.reduce((sum, v) => sum + v.commissionRate, 0) / vendors.length;

  const handleAddVendor = (data: any) => {
    const newVendor: Vendor = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      commissionRate: data.commissionRate,
      totalSales: 0,
      monthlyCommission: 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      products: data.products,
    };

    setVendors([...vendors, newVendor]);
    toast({
      title: "Vendor Added",
      description: `${data.name} has been successfully added to your ice cream vendor network.`,
    });
  };

  const handleEditVendor = (data: any) => {
    if (!editingVendor) return;

    const updatedVendors = vendors.map(vendor =>
      vendor.id === editingVendor.id
        ? {
            ...vendor,
            name: data.name,
            email: data.email,
            phone: data.phone,
            commissionRate: data.commissionRate,
            products: data.products,
          }
        : vendor
    );

    setVendors(updatedVendors);
    setEditingVendor(null);
    toast({
      title: "Vendor Updated",
      description: `${data.name} has been successfully updated.`,
    });
  };

  const handleDeleteVendor = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    if (window.confirm(`Are you sure you want to delete ${vendor.name}? This action cannot be undone.`)) {
      setVendors(vendors.filter(v => v.id !== vendorId));
      toast({
        title: "Vendor Deleted",
        description: `${vendor.name} has been removed from your vendor network.`,
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingVendor(null);
    setFormOpen(true);
  };

  const openEditDialog = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingVendor) {
      handleEditVendor(data);
    } else {
      handleAddVendor(data);
    }
  };

  return (
    <Layout>
      <div className="space-y-8 p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ice Cream Vendors
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your ice cream supply vendors and their commission rates
            </p>
          </div>
          <Button 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
            onClick={openAddDialog}
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Add New Vendor
          </Button>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Vendors</CardTitle>
              <Users className="h-5 w-5 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{vendors.length}</div>
              <p className="text-xs text-blue-200 mt-1">
                <span className="bg-blue-400/30 px-2 py-1 rounded-full">{activeVendors} active</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Monthly Commissions</CardTitle>
              <DollarSign className="h-5 w-5 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalCommission.toFixed(2)}</div>
              <p className="text-xs text-green-200 mt-1">this month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Avg Commission Rate</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgCommissionRate.toFixed(1)}%</div>
              <p className="text-xs text-purple-200 mt-1">across all vendors</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Active Vendors</CardTitle>
              <Building2 className="h-5 w-5 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeVendors}</div>
              <p className="text-xs text-orange-200 mt-1">currently supplying</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Vendors List */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {vendor.name.charAt(0)}
                      </div>
                      <div>
                        {vendor.name}
                        <Badge 
                          variant={vendor.status === 'active' ? 'default' : 'secondary'} 
                          className={`ml-2 ${vendor.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                        >
                          {vendor.status}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Member since {new Date(vendor.joinDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditDialog(vendor)}
                      className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      onClick={() => handleDeleteVendor(vendor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                    <Phone className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{vendor.phone}</span>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <p className="text-xs text-green-600 font-medium mb-1">Commission Rate</p>
                    <p className="font-bold text-xl text-green-700">{vendor.commissionRate}%</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <p className="text-xs text-blue-600 font-medium mb-1">Monthly Commission</p>
                    <p className="font-bold text-xl text-blue-700">${vendor.monthlyCommission.toFixed(2)}</p>
                  </div>
                  <div className="col-span-2 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <p className="text-xs text-purple-600 font-medium mb-1">Total Sales</p>
                    <p className="font-bold text-2xl text-purple-700">${vendor.totalSales.toLocaleString()}</p>
                  </div>
                </div>

                {/* Ice Cream Products */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-orange-500" />
                    <p className="text-sm font-medium text-gray-700">Ice Cream Products Supplied</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vendor.products.map((product, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 text-orange-700 hover:bg-orange-100 transition-colors"
                      >
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vendor Form Dialog */}
        <VendorFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          vendor={editingVendor}
          onSubmit={handleFormSubmit}
        />
      </div>
    </Layout>
  );
};

export default Vendors;
