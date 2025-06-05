
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem } from '@/pages/Inventory';
import { 
  DollarSign, 
  Package, 
  Calculator,
  Plus,
  Minus,
  Sunrise,
  Sunset
} from 'lucide-react';

interface VendorInventoryItem {
  itemId: string;
  itemName: string;
  unitPrice: number;
  unitCost: number;
  quantityTaken: number;
  quantityReturned: number;
  quantitySold: number;
}

interface DailySalesData {
  vendorName: string;
  date: string;
  itemsData: VendorInventoryItem[];
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  vendorCommission: number;
  netProfit: number;
}

const WorkerSalesForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedVendor, setSelectedVendor] = useState('');
  const [vendorItems, setVendorItems] = useState<VendorInventoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');

  // Mock data - in real app, this would come from database
  const vendors = [
    { id: '1', name: 'Sweet Scoops Supply', commissionRate: 8.5 },
    { id: '2', name: 'Frozen Delights Inc', commissionRate: 7.0 },
    { id: '3', name: 'Cone Corner', commissionRate: 6.5 }
  ];

  const inventoryItems: InventoryItem[] = [
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

  const initializeVendorItems = (vendorId: string) => {
    if (!vendorId) return;
    
    const items: VendorInventoryItem[] = inventoryItems.map(item => ({
      itemId: item.id,
      itemName: item.name,
      unitPrice: item.price,
      unitCost: item.cost,
      quantityTaken: 0,
      quantityReturned: 0,
      quantitySold: 0
    }));
    
    setVendorItems(items);
  };

  const updateQuantityTaken = (itemId: string, quantity: string) => {
    const qty = parseInt(quantity) || 0;
    setVendorItems(prev => prev.map(item => {
      if (item.itemId === itemId) {
        const updated = { ...item, quantityTaken: qty };
        updated.quantitySold = Math.max(0, updated.quantityTaken - updated.quantityReturned);
        return updated;
      }
      return item;
    }));
  };

  const updateQuantityReturned = (itemId: string, quantity: string) => {
    const qty = parseInt(quantity) || 0;
    setVendorItems(prev => prev.map(item => {
      if (item.itemId === itemId) {
        const updated = { ...item, quantityReturned: qty };
        updated.quantitySold = Math.max(0, updated.quantityTaken - updated.quantityReturned);
        return updated;
      }
      return item;
    }));
  };

  // Calculations
  const totalRevenue = vendorItems.reduce((sum, item) => 
    sum + (item.quantitySold * item.unitPrice), 0
  );
  
  const totalCost = vendorItems.reduce((sum, item) => 
    sum + (item.quantitySold * item.unitCost), 0
  );
  
  const grossProfit = totalRevenue - totalCost;
  
  const vendor = vendors.find(v => v.id === selectedVendor);
  const vendorCommission = vendor ? (totalRevenue * vendor.commissionRate / 100) : 0;
  const netProfit = grossProfit - vendorCommission;

  const handleSubmit = () => {
    if (!selectedVendor || vendorItems.length === 0) {
      toast({
        title: "Incomplete Information",
        description: "Please select a vendor and fill in the quantities.",
        variant: "destructive"
      });
      return;
    }

    const hasItemsTaken = vendorItems.some(item => item.quantityTaken > 0);
    const hasItemsReturned = vendorItems.some(item => item.quantityReturned > 0);

    if (!hasItemsTaken) {
      toast({
        title: "No Items Taken",
        description: "Please record items taken by the vendor in the morning.",
        variant: "destructive"
      });
      return;
    }

    const salesData: DailySalesData = {
      vendorName: vendor?.name || '',
      date: new Date().toISOString().split('T')[0],
      itemsData: vendorItems.filter(item => item.quantityTaken > 0),
      totalRevenue,
      totalCost,
      grossProfit,
      vendorCommission,
      netProfit
    };

    console.log('Daily Sales Data Submitted:', salesData);
    
    toast({
      title: "Sales Recorded",
      description: `Daily sales for ${vendor?.name} have been recorded successfully.`
    });

    // Reset form
    setSelectedVendor('');
    setVendorItems([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Record Daily Sales</h2>
        <p className="text-gray-600 mt-1">Track vendor inventory and calculate daily profit</p>
      </div>

      {/* Vendor Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Vendor</CardTitle>
          <CardDescription>Choose the vendor to record daily sales for</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Select 
              value={selectedVendor} 
              onValueChange={(value) => {
                setSelectedVendor(value);
                initializeVendorItems(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a vendor..." />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name} ({vendor.commissionRate}% commission)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      {selectedVendor && (
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'morning' ? 'default' : 'outline'}
            onClick={() => setActiveTab('morning')}
            className="flex items-center gap-2"
          >
            <Sunrise className="h-4 w-4" />
            Morning - Items Taken
          </Button>
          <Button
            variant={activeTab === 'evening' ? 'default' : 'outline'}
            onClick={() => setActiveTab('evening')}
            className="flex items-center gap-2"
          >
            <Sunset className="h-4 w-4" />
            Evening - Items Returned
          </Button>
        </div>
      )}

      {/* Morning Tab - Items Taken */}
      {selectedVendor && activeTab === 'morning' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sunrise className="h-5 w-5 text-orange-500" />
              Morning - Record Items Taken
            </CardTitle>
            <CardDescription>Enter how many ice creams the vendor took to sell today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendorItems.map((item) => (
                <div key={item.itemId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium">{item.itemName}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ${item.unitPrice} each
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Quantity Taken:</Label>
                    <Input
                      type="number"
                      min="0"
                      value={item.quantityTaken || ''}
                      onChange={(e) => updateQuantityTaken(item.itemId, e.target.value)}
                      className="w-20"
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evening Tab - Items Returned */}
      {selectedVendor && activeTab === 'evening' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sunset className="h-5 w-5 text-purple-500" />
              Evening - Record Items Returned
            </CardTitle>
            <CardDescription>Enter how many ice creams came back unsold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendorItems.map((item) => (
                <div key={item.itemId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium">{item.itemName}</span>
                    <div className="text-sm text-gray-500">
                      Taken: {item.quantityTaken} | Sold: <span className="font-medium text-green-600">{item.quantitySold}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Returned:</Label>
                    <Input
                      type="number"
                      min="0"
                      max={item.quantityTaken}
                      value={item.quantityReturned || ''}
                      onChange={(e) => updateQuantityReturned(item.itemId, e.target.value)}
                      className="w-20"
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profit Calculation */}
      {selectedVendor && vendorItems.some(item => item.quantitySold > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Daily Profit Calculation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Revenue:</span>
                  <span className="font-medium">${totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-medium">${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Gross Profit:</span>
                  <span className="font-bold">${grossProfit.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Vendor Commission ({vendor?.commissionRate}%):</span>
                  <span className="font-medium">${vendorCommission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>Net Profit:</span>
                  <span className="font-bold">${netProfit.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Items Summary */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Items Sold Summary:</h4>
              <div className="space-y-1">
                {vendorItems.filter(item => item.quantitySold > 0).map(item => (
                  <div key={item.itemId} className="flex justify-between text-sm">
                    <span>{item.itemName}:</span>
                    <span>{item.quantitySold} units (${(item.quantitySold * item.unitPrice).toFixed(2)})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={!selectedVendor || vendorItems.length === 0}
      >
        Record Daily Sales
      </Button>
    </div>
  );
};

export default WorkerSalesForm;
