
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Package, 
  Edit3,
  AlertTriangle,
  Filter
} from 'lucide-react';
import AddItemDialog from '@/components/AddItemDialog';
import EditItemDialog from '@/components/EditItemDialog';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  cost: number;
  lowStockThreshold: number;
  description?: string;
}

const Inventory = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Mock inventory data based on business type
  const [inventory, setInventory] = useState<InventoryItem[]>(
    user?.businessType === 'medical' ? [
      {
        id: '1',
        name: 'Paracetamol 500mg',
        category: 'Fever Medicine',
        stock: 45,
        price: 8.50,
        cost: 5.00,
        lowStockThreshold: 20,
        description: 'Pain relief and fever reducer'
      },
      {
        id: '2',
        name: 'Cough Syrup',
        category: 'Cough Medicine',
        stock: 8,
        price: 18.00,
        cost: 12.00,
        lowStockThreshold: 15,
        description: 'For dry and wet cough'
      },
      {
        id: '3',
        name: 'Antiseptic Solution',
        category: 'First Aid',
        stock: 25,
        price: 15.00,
        cost: 9.00,
        lowStockThreshold: 10,
        description: 'Wound cleaning and disinfection'
      },
      {
        id: '4',
        name: 'Vitamin D3',
        category: 'Vitamins',
        stock: 3,
        price: 25.00,
        cost: 18.00,
        lowStockThreshold: 12,
        description: 'Daily vitamin supplement'
      },
    ] : [
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
      },
    ]
  );

  const categories = user?.businessType === 'medical' 
    ? ['Fever Medicine', 'Cough Medicine', 'First Aid', 'Vitamins', 'Antibiotics']
    : ['Cornetto', 'Cup', 'Bar', 'Kulfi', 'Sandwich'];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = filteredInventory.filter(item => item.stock <= item.lowStockThreshold);
  const allItems = filteredInventory;

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowEditDialog(true);
  };

  const handleUpdateItem = (updatedItem: InventoryItem) => {
    setInventory(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const handleAddItem = (newItem: Omit<InventoryItem, 'id'>) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
    };
    setInventory(prev => [...prev, item]);
  };

  const getStockBadge = (item: InventoryItem) => {
    if (item.stock <= item.lowStockThreshold) {
      return <Badge variant="destructive">Low Stock</Badge>;
    } else if (item.stock <= item.lowStockThreshold * 2) {
      return <Badge variant="outline" className="text-orange-600 border-orange-200">Medium</Badge>;
    } else {
      return <Badge variant="outline" className="text-green-600 border-green-200">In Stock</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-600 mt-1">Manage your stock and pricing</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Inventory Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Items ({allItems.length})</TabsTrigger>
            <TabsTrigger value="low-stock" className="text-orange-600">
              Low Stock ({lowStockItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>{item.category}</CardDescription>
                      </div>
                      {getStockBadge(item)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Stock:</span>
                        <span className="font-medium">{item.stock} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-medium">${item.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cost:</span>
                        <span className="font-medium">${item.cost}</span>
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-2">{item.description}</p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit3 className="h-3 w-3 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="low-stock">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.map((item) => (
                <Card key={item.id} className="border-orange-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          {item.name}
                        </CardTitle>
                        <CardDescription>{item.category}</CardDescription>
                      </div>
                      <Badge variant="destructive">Low Stock</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Stock:</span>
                        <span className="font-medium text-orange-600">{item.stock} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Threshold:</span>
                        <span className="font-medium">{item.lowStockThreshold} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-medium">${item.price}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit3 className="h-3 w-3 mr-2" />
                        Update Stock
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AddItemDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAddItem={handleAddItem}
          categories={categories}
        />

        {selectedItem && (
          <EditItemDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            item={selectedItem}
            onUpdateItem={handleUpdateItem}
            categories={categories}
          />
        )}
      </div>
    </Layout>
  );
};

export default Inventory;
