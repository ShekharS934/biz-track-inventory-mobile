
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem } from '@/pages/Inventory';
import { 
  DollarSign, 
  Package, 
  Calculator,
  Plus,
  Minus,
  Sunrise,
  Sunset,
  Lock,
  CheckCircle,
  Users,
  UserPlus
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

interface VendorData {
  vendorId: string;
  vendorName: string;
  items: VendorInventoryItem[];
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  vendorCommission: number;
  netProfit: number;
  commissionRate: number;
}

interface DailySalesData {
  date: string;
  vendors: VendorData[];
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  totalVendorCommission: number;
  totalNetProfit: number;
}

const WorkerSalesForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [vendorItemsData, setVendorItemsData] = useState<{[vendorId: string]: VendorInventoryItem[]}>({});
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');
  const [morningStockLocked, setMorningStockLocked] = useState(false);
  const [activeVendorForEvening, setActiveVendorForEvening] = useState<string>('');
  const [showAddVendorForm, setShowAddVendorForm] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCommission, setNewVendorCommission] = useState('');

  // Mock data - in real app, this would come from database
  const [vendors, setVendors] = useState([
    { id: '1', name: 'Sweet Scoops Supply', commissionRate: 8.5 },
    { id: '2', name: 'Frozen Delights Inc', commissionRate: 7.0 },
    { id: '3', name: 'Cone Corner', commissionRate: 6.5 }
  ]);

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

  const handleVendorSelection = (vendorId: string) => {
    if (morningStockLocked) return;
    
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(prev => prev.filter(id => id !== vendorId));
      setVendorItemsData(prev => {
        const newData = { ...prev };
        delete newData[vendorId];
        return newData;
      });
    } else {
      setSelectedVendors(prev => [...prev, vendorId]);
      const items: VendorInventoryItem[] = inventoryItems.map(item => ({
        itemId: item.id,
        itemName: item.name,
        unitPrice: item.price,
        unitCost: item.cost,
        quantityTaken: 0,
        quantityReturned: 0,
        quantitySold: 0
      }));
      setVendorItemsData(prev => ({ ...prev, [vendorId]: items }));
    }
  };

  const handleAddNewVendor = () => {
    if (!newVendorName.trim() || !newVendorCommission.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter vendor name and commission rate.",
        variant: "destructive"
      });
      return;
    }

    const commission = parseFloat(newVendorCommission);
    if (isNaN(commission) || commission < 0 || commission > 100) {
      toast({
        title: "Invalid Commission",
        description: "Commission rate must be a number between 0 and 100.",
        variant: "destructive"
      });
      return;
    }

    const newVendorId = Date.now().toString();
    const newVendor = {
      id: newVendorId,
      name: newVendorName.trim(),
      commissionRate: commission
    };

    setVendors(prev => [...prev, newVendor]);
    setNewVendorName('');
    setNewVendorCommission('');
    setShowAddVendorForm(false);

    toast({
      title: "Vendor Added",
      description: `${newVendor.name} has been added successfully.`
    });
  };

  const updateQuantityTaken = (vendorId: string, itemId: string, quantity: string) => {
    if (morningStockLocked) return;
    
    const qty = parseInt(quantity) || 0;
    setVendorItemsData(prev => ({
      ...prev,
      [vendorId]: prev[vendorId]?.map(item => {
        if (item.itemId === itemId) {
          const updated = { ...item, quantityTaken: qty };
          updated.quantitySold = Math.max(0, updated.quantityTaken - updated.quantityReturned);
          return updated;
        }
        return item;
      }) || []
    }));
  };

  const updateQuantityReturned = (vendorId: string, itemId: string, quantity: string) => {
    const qty = parseInt(quantity) || 0;
    setVendorItemsData(prev => ({
      ...prev,
      [vendorId]: prev[vendorId]?.map(item => {
        if (item.itemId === itemId) {
          const updated = { ...item, quantityReturned: qty };
          updated.quantitySold = Math.max(0, updated.quantityTaken - updated.quantityReturned);
          return updated;
        }
        return item;
      }) || []
    }));
  };

  const lockMorningStock = () => {
    const hasAnyItems = Object.values(vendorItemsData).some(items =>
      items.some(item => item.quantityTaken > 0)
    );
    
    if (!hasAnyItems) {
      toast({
        title: "No Items Taken",
        description: "Please record at least one item before locking morning stock.",
        variant: "destructive"
      });
      return;
    }

    setMorningStockLocked(true);
    setActiveTab('evening');
    
    // Set first vendor with items as active for evening
    const firstVendorWithItems = selectedVendors.find(vendorId =>
      vendorItemsData[vendorId]?.some(item => item.quantityTaken > 0)
    );
    if (firstVendorWithItems) {
      setActiveVendorForEvening(firstVendorWithItems);
    }
    
    toast({
      title: "Morning Stock Locked",
      description: "You can now record evening returns for each vendor."
    });
  };

  // Get vendors that have items taken for evening display
  const getVendorsWithItems = () => {
    return selectedVendors.filter(vendorId =>
      vendorItemsData[vendorId]?.some(item => item.quantityTaken > 0)
    );
  };

  // Get items for a specific vendor that were taken in morning
  const getVendorEveningItems = (vendorId: string) => {
    return vendorItemsData[vendorId]?.filter(item => item.quantityTaken > 0) || [];
  };

  // Calculate totals for all vendors
  const calculateOverallTotals = () => {
    let totalRevenue = 0;
    let totalCost = 0;
    let totalVendorCommission = 0;

    selectedVendors.forEach(vendorId => {
      const vendor = vendors.find(v => v.id === vendorId);
      const items = vendorItemsData[vendorId] || [];
      
      const vendorRevenue = items.reduce((sum, item) => sum + (item.quantitySold * item.unitPrice), 0);
      const vendorCost = items.reduce((sum, item) => sum + (item.quantitySold * item.unitCost), 0);
      const vendorCommission = vendor ? (vendorRevenue * vendor.commissionRate / 100) : 0;

      totalRevenue += vendorRevenue;
      totalCost += vendorCost;
      totalVendorCommission += vendorCommission;
    });

    const grossProfit = totalRevenue - totalCost;
    const totalNetProfit = grossProfit - totalVendorCommission;

    return { totalRevenue, totalCost, grossProfit, totalVendorCommission, totalNetProfit };
  };

  const handleSubmit = () => {
    if (selectedVendors.length === 0) {
      toast({
        title: "No Vendors Selected",
        description: "Please select at least one vendor.",
        variant: "destructive"
      });
      return;
    }

    if (!morningStockLocked) {
      toast({
        title: "Morning Stock Not Locked",
        description: "Please lock the morning stock before submitting daily sales.",
        variant: "destructive"
      });
      return;
    }

    const vendorDataArray: VendorData[] = selectedVendors.map(vendorId => {
      const vendor = vendors.find(v => v.id === vendorId);
      const items = vendorItemsData[vendorId] || [];
      
      const totalRevenue = items.reduce((sum, item) => sum + (item.quantitySold * item.unitPrice), 0);
      const totalCost = items.reduce((sum, item) => sum + (item.quantitySold * item.unitCost), 0);
      const grossProfit = totalRevenue - totalCost;
      const vendorCommission = vendor ? (totalRevenue * vendor.commissionRate / 100) : 0;
      const netProfit = grossProfit - vendorCommission;

      return {
        vendorId,
        vendorName: vendor?.name || '',
        items: items.filter(item => item.quantitySold > 0),
        totalRevenue,
        totalCost,
        grossProfit,
        vendorCommission,
        netProfit,
        commissionRate: vendor?.commissionRate || 0
      };
    });

    const overallTotals = calculateOverallTotals();
    
    const salesData: DailySalesData = {
      date: new Date().toISOString().split('T')[0],
      vendors: vendorDataArray,
      ...overallTotals
    };

    console.log('Multi-Vendor Daily Sales Data Submitted:', salesData);
    
    toast({
      title: "Sales Recorded",
      description: `Daily sales for ${selectedVendors.length} vendor(s) have been recorded successfully.`
    });

    // Reset form
    setSelectedVendors([]);
    setVendorItemsData({});
    setMorningStockLocked(false);
    setActiveVendorForEvening('');
    setActiveTab('morning');
  };

  const overallTotals = calculateOverallTotals();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Record Daily Sales</h2>
        <p className="text-gray-600 mt-1">Track multiple vendors' inventory and calculate daily profit</p>
      </div>

      {/* Vendor Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Vendors
          </CardTitle>
          <CardDescription>Choose the vendors to record daily sales for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Vendor Dropdown */}
            <div className="flex items-center gap-2">
              <Select onValueChange={handleVendorSelection} disabled={morningStockLocked}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select vendors to add" />
                </SelectTrigger>
                <SelectContent>
                  {vendors
                    .filter(vendor => !selectedVendors.includes(vendor.id))
                    .map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name} ({vendor.commissionRate}% commission)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              <Button
                onClick={() => setShowAddVendorForm(!showAddVendorForm)}
                variant="outline"
                className="flex items-center gap-2"
                disabled={morningStockLocked}
              >
                <UserPlus className="h-4 w-4" />
                Add New
              </Button>
            </div>

            {/* Add New Vendor Form */}
            {showAddVendorForm && (
              <Card className="border-dashed">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vendor-name">Vendor Name</Label>
                      <Input
                        id="vendor-name"
                        value={newVendorName}
                        onChange={(e) => setNewVendorName(e.target.value)}
                        placeholder="Enter vendor name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                      <Input
                        id="commission-rate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={newVendorCommission}
                        onChange={(e) => setNewVendorCommission(e.target.value)}
                        placeholder="e.g., 8.5"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddNewVendor} className="flex-1">
                        Add Vendor
                      </Button>
                      <Button 
                        onClick={() => {
                          setShowAddVendorForm(false);
                          setNewVendorName('');
                          setNewVendorCommission('');
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected Vendors Display */}
            {selectedVendors.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Selected Vendors:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedVendors.map(vendorId => {
                    const vendor = vendors.find(v => v.id === vendorId);
                    return (
                      <Badge key={vendorId} variant="secondary" className="flex items-center gap-1">
                        {vendor?.name}
                        {!morningStockLocked && (
                          <button
                            onClick={() => handleVendorSelection(vendorId)}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {morningStockLocked && (
              <div className="flex items-center gap-2 text-green-600">
                <Lock className="h-4 w-4" />
                <span className="text-sm">Vendor selection locked for this session</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      {selectedVendors.length > 0 && (
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'morning' ? 'default' : 'outline'}
            onClick={() => setActiveTab('morning')}
            className="flex items-center gap-2"
            disabled={morningStockLocked}
          >
            <Sunrise className="h-4 w-4" />
            Morning - Items Taken
            {morningStockLocked && <CheckCircle className="h-4 w-4 text-green-500" />}
          </Button>
          <Button
            variant={activeTab === 'evening' ? 'default' : 'outline'}
            onClick={() => setActiveTab('evening')}
            className="flex items-center gap-2"
            disabled={!morningStockLocked}
          >
            <Sunset className="h-4 w-4" />
            Evening - Items Returned
          </Button>
        </div>
      )}

      {/* Morning Tab - Items Taken */}
      {selectedVendors.length > 0 && activeTab === 'morning' && (
        <div className="space-y-6">
          {selectedVendors.map(vendorId => {
            const vendor = vendors.find(v => v.id === vendorId);
            const items = vendorItemsData[vendorId] || [];
            
            return (
              <Card key={vendorId}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sunrise className="h-5 w-5 text-orange-500" />
                    {vendor?.name} - Morning Stock
                  </CardTitle>
                  <CardDescription>Enter how many ice creams this vendor took to sell today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
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
                            onChange={(e) => updateQuantityTaken(vendorId, item.itemId, e.target.value)}
                            className="w-20"
                            placeholder="0"
                            disabled={morningStockLocked}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {!morningStockLocked && (
            <Button 
              onClick={lockMorningStock}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={selectedVendors.length === 0}
            >
              <Lock className="h-4 w-4 mr-2" />
              Lock Morning Stock for All Vendors
            </Button>
          )}

          {morningStockLocked && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Morning stock has been locked</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                You can now proceed to evening returns for each vendor.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Evening Tab - Items Returned */}
      {selectedVendors.length > 0 && activeTab === 'evening' && morningStockLocked && (
        <div className="space-y-6">
          {/* Vendor Selection for Evening */}
          <Card>
            <CardHeader>
              <CardTitle>Select Vendor for Evening Returns</CardTitle>
              <CardDescription>Choose which vendor's returns to record</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {getVendorsWithItems().map(vendorId => {
                  const vendor = vendors.find(v => v.id === vendorId);
                  return (
                    <Button
                      key={vendorId}
                      variant={activeVendorForEvening === vendorId ? 'default' : 'outline'}
                      onClick={() => setActiveVendorForEvening(vendorId)}
                      className="flex items-center gap-2"
                    >
                      {vendor?.name}
                      <Badge variant="secondary">
                        {getVendorEveningItems(vendorId).length} items
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Vendor's Evening Items */}
          {activeVendorForEvening && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sunset className="h-5 w-5 text-purple-500" />
                  {vendors.find(v => v.id === activeVendorForEvening)?.name} - Evening Returns
                </CardTitle>
                <CardDescription>
                  Enter how many ice creams came back unsold from this vendor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getVendorEveningItems(activeVendorForEvening).map((item) => (
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
                          onChange={(e) => updateQuantityReturned(activeVendorForEvening, item.itemId, e.target.value)}
                          className="w-20"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  ))}
                  {getVendorEveningItems(activeVendorForEvening).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No items were taken by this vendor in the morning</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Overall Profit Calculation */}
      {selectedVendors.length > 0 && morningStockLocked && overallTotals.totalRevenue > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Overall Daily Profit Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Revenue:</span>
                  <span className="font-medium">${overallTotals.totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-medium">${overallTotals.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Gross Profit:</span>
                  <span className="font-bold">${overallTotals.grossProfit.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Vendor Commission:</span>
                  <span className="font-medium">${overallTotals.totalVendorCommission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>Net Profit:</span>
                  <span className="font-bold">${overallTotals.totalNetProfit.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Individual Vendor Breakdown */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-4">Vendor Breakdown:</h4>
              <div className="space-y-3">
                {selectedVendors.map(vendorId => {
                  const vendor = vendors.find(v => v.id === vendorId);
                  const items = vendorItemsData[vendorId] || [];
                  const soldItems = items.filter(item => item.quantitySold > 0);
                  
                  if (soldItems.length === 0) return null;
                  
                  const vendorRevenue = soldItems.reduce((sum, item) => sum + (item.quantitySold * item.unitPrice), 0);
                  const vendorCommission = vendor ? (vendorRevenue * vendor.commissionRate / 100) : 0;
                  
                  return (
                    <div key={vendorId} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{vendor?.name}</span>
                        <div className="text-sm">
                          Revenue: ${vendorRevenue.toFixed(2)} | Commission: ${vendorCommission.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Items sold: {soldItems.map(item => `${item.itemName} (${item.quantitySold})`).join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={selectedVendors.length === 0 || !morningStockLocked}
      >
        Record Multi-Vendor Daily Sales
      </Button>
    </div>
  );
};

export default WorkerSalesForm;
