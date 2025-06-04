
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { InventoryItem } from '@/pages/Inventory';

interface VendorFormData {
  name: string;
  email: string;
  phone: string;
  commissionRate: number;
  products: string[];
}

interface VendorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: any;
  onSubmit: (data: VendorFormData) => void;
}

const VendorFormDialog: React.FC<VendorFormDialogProps> = ({
  open,
  onOpenChange,
  vendor,
  onSubmit,
}) => {
  const form = useForm<VendorFormData>({
    defaultValues: {
      name: vendor?.name || '',
      email: vendor?.email || '',
      phone: vendor?.phone || '',
      commissionRate: vendor?.commissionRate || 0,
      products: vendor?.products || [],
    },
  });

  const [selectedProduct, setSelectedProduct] = React.useState('');
  const products = form.watch('products') || [];

  // Mock inventory data for ice cream business
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
    },
    {
      id: '5',
      name: 'Chocolate Cornetto',
      category: 'Cornetto',
      stock: 32,
      price: 3.50,
      cost: 2.00,
      lowStockThreshold: 20,
      description: 'Rich chocolate ice cream cone'
    },
    {
      id: '6',
      name: 'Vanilla Bar',
      category: 'Bar',
      stock: 18,
      price: 4.00,
      cost: 2.50,
      lowStockThreshold: 25,
      description: 'Creamy vanilla ice cream bar'
    },
    {
      id: '7',
      name: 'Mint Chocolate Cup',
      category: 'Cup',
      stock: 22,
      price: 3.25,
      cost: 1.90,
      lowStockThreshold: 15,
      description: 'Refreshing mint chocolate ice cream'
    },
    {
      id: '8',
      name: 'Pistachio Kulfi',
      category: 'Kulfi',
      stock: 15,
      price: 2.75,
      cost: 1.60,
      lowStockThreshold: 20,
      description: 'Rich pistachio kulfi'
    }
  ];

  const addProduct = () => {
    if (selectedProduct && !products.includes(selectedProduct)) {
      form.setValue('products', [...products, selectedProduct]);
      setSelectedProduct('');
    }
  };

  const removeProduct = (productToRemove: string) => {
    form.setValue('products', products.filter(p => p !== productToRemove));
  };

  const handleSubmit = (data: VendorFormData) => {
    onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  React.useEffect(() => {
    if (vendor) {
      form.reset({
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        commissionRate: vendor.commissionRate,
        products: vendor.products,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        commissionRate: 0,
        products: [],
      });
    }
  }, [vendor, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {vendor ? 'Edit Vendor' : 'Add New Vendor'}
          </DialogTitle>
          <DialogDescription>
            {vendor 
              ? 'Update vendor information and commission details.' 
              : 'Add a new ice cream vendor to your supply chain.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sweet Scoops Supply" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@vendor.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Rate (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1" 
                      min="0" 
                      max="100" 
                      placeholder="8.5"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Ice Cream Products</label>
              <div className="flex gap-2">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select from inventory..." />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryItems
                      .filter(item => !products.includes(item.name))
                      .map((item) => (
                        <SelectItem key={item.id} value={item.name}>
                          {item.name} - {item.category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  onClick={addProduct}
                  disabled={!selectedProduct}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {products.map((product, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {product}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => removeProduct(product)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {vendor ? 'Update Vendor' : 'Add Vendor'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VendorFormDialog;
