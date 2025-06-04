
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

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

  const [productInput, setProductInput] = React.useState('');
  const products = form.watch('products') || [];

  const addProduct = () => {
    if (productInput.trim() && !products.includes(productInput.trim())) {
      form.setValue('products', [...products, productInput.trim()]);
      setProductInput('');
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
                <Input
                  placeholder="e.g., Vanilla Cones"
                  value={productInput}
                  onChange={(e) => setProductInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProduct())}
                />
                <Button type="button" onClick={addProduct}>Add</Button>
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
