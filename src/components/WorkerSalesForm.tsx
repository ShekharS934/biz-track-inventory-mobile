
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
  Minus
} from 'lucide-react';

interface SaleItem {
  itemId: string;
  itemName: string;
  quantitySold: number;
  unitPrice: number;
  unitCost: number;
}

interface DailySalesData {
  vendorName: string;
  totalAmountTaken: number;
  itemsSold: SaleItem[];
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
  const [amountTaken, setAmountTaken] = useState('');
  const [itemsSold, setItemsSold] = useState<SaleItem[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');

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

  const addItem = () => {
    const item = inventoryItems.find(i => i.id === selectedItem);
    const qty = parseInt(quantity);
    
    if (!item || !qty || qty <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please select an item and enter a valid quantity.",
        variant: "destructive"
      });
      return;
    }

    const existingItemIndex = itemsSold.findIndex(i => i.itemId === selectedItem);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...itemsSold];
      updatedItems[existingItemIndex].quantitySold += qty;
      setItemsSold(updatedItems);
    } else {
      const newSaleItem: SaleItem = {
        itemId: item.id,
        itemName: item.name,
        quantitySold: qty,
        unitPrice: item.price,
        unitCost: item.cost
      };
      setItemsSold([...itemsSold, newSaleItem]);
    }
    
    setSelectedItem('');
    setQuantity('');
  };

  const removeItem = (itemId: string) => {
    setItemsSold(itemsSold.filter(item => item.itemId !== itemId));
  };

  const updateQuantity = (itemId: string, change: number) => {
    setItemsSold(itemsSold.map(item => {
      if (item.itemId === itemId) {
        const newQuantity = Math.max(0, item.quantitySold + change);
        return { ...item, quantitySold: newQuantity };
      }
      return item;
    }).filter(item => item.quantitySold > 0));
  };

  // Calculations
  const totalRevenue = itemsSold.reduce((sum, item) => 
    sum + (item.quantitySold * item.unitPrice), 0
  );
  
  const totalCost = itemsSold.reduce((sum, item) => 
    sum + (item.quantitySold * item.unitCost), 0
  );
  
  const grossProfit = totalRevenue - totalCost;
  
  const vendor = vendors.find(v => v.id === selectedVendor);
  const vendorCommission = vendor ? (totalRevenue * vendor.commissionRate / 100) : 0;
  const netProfit = grossProfit - vendorCommission;

  const handleSubmit = () => {
    if (!selectedVendor || !amountTaken || itemsSold.length === 0) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in vendor, amount taken, and add at least one item sold.",
        variant: "destructive"
      });
      return;
    }

    const salesData: DailySalesData = {
      vendorName: vendor?.name || '',
      totalAmountTaken: parseFloat(amountTaken),
      itemsSold,
      totalRevenue,
      totalCost,
      grossProfit,
      vendorCommission,
      netProfit
    };

    console.log('Sales Data Submitted:', salesData);
    
    toast({
      title: "Sales Recorded",
      description: `Daily sales for ${vendor?.name} have been recorded successfully.`
    });

    // Reset form
    setSelectedVendor('');
    setAmountTaken('');
    setItemsSold([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Record Daily Sales</h2>
        <p className="text-gray-600 mt-1">Enter vendor sales and items sold for profit calculation</p>
      </div>

      {/* Vendor Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Information</CardTitle>
          <CardDescription>Select the vendor and enter the amount they took</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
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
          
          <div>
            <Label htmlFor="amount">Amount Taken ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amountTaken}
              onChange={(e) => setAmountTaken(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Items Sold */}
      <Card>
        <CardHeader>
          <CardTitle>Items Sold</CardTitle>
          <CardDescription>Add the ice cream items that were sold</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select item..." />
              </SelectTrigger>
              <SelectContent>
                {inventoryItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} - ${item.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Qty"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-20"
            />
            <Button onClick={addItem} disabled={!selectedItem || !quantity}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {itemsSold.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Items Added:</h4>
              {itemsSold.map((item) => (
                <div key={item.itemId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{item.itemName}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ${item.unitPrice} each
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateQuantity(item.itemId, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-medium w-8 text-center">{item.quantitySold}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateQuantity(item.itemId, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeItem(item.itemId)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profit Calculation */}
      {itemsSold.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Profit Calculation
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
                  <span>Vendor Commission:</span>
                  <span className="font-medium">${vendorCommission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>Net Profit:</span>
                  <span className="font-bold">${netProfit.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={!selectedVendor || !amountTaken || itemsSold.length === 0}
      >
        Record Daily Sales
      </Button>
    </div>
  );
};

export default WorkerSalesForm;
