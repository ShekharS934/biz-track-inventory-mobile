
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FileText, 
  TrendingUp, 
  Calendar,
  Download,
  Brain,
  Zap
} from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const [generatingReport, setGeneratingReport] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  // Mock data for charts
  const monthlySalesData = [
    { month: 'Jan', sales: 2400, profit: 800 },
    { month: 'Feb', sales: 1398, profit: 450 },
    { month: 'Mar', sales: 9800, profit: 2100 },
    { month: 'Apr', sales: 3908, profit: 1200 },
    { month: 'May', sales: 4800, profit: 1600 },
    { month: 'Jun', sales: 3800, profit: 1100 },
  ];

  const categoryData = user?.businessType === 'medical' ? [
    { name: 'Fever Medicine', value: 35, color: '#8884d8' },
    { name: 'Cough Medicine', value: 25, color: '#82ca9d' },
    { name: 'First Aid', value: 20, color: '#ffc658' },
    { name: 'Vitamins', value: 20, color: '#ff7300' },
  ] : [
    { name: 'Cornetto', value: 30, color: '#8884d8' },
    { name: 'Bar', value: 25, color: '#82ca9d' },
    { name: 'Cup', value: 25, color: '#ffc658' },
    { name: 'Kulfi', value: 20, color: '#ff7300' },
  ];

  const topSellingItems = user?.businessType === 'medical' ? [
    { name: 'Paracetamol 500mg', sales: 145, revenue: 1232.50 },
    { name: 'Cough Syrup', sales: 89, revenue: 1602.00 },
    { name: 'Antiseptic Solution', sales: 76, revenue: 1140.00 },
    { name: 'Vitamin D3', sales: 52, revenue: 1300.00 },
  ] : [
    { name: 'Vanilla Cornetto', sales: 234, revenue: 819.00 },
    { name: 'Chocolate Bar', sales: 189, revenue: 756.00 },
    { name: 'Strawberry Cup', sales: 167, revenue: 501.00 },
    { name: 'Mango Kulfi', sales: 134, revenue: 335.00 },
  ];

  const generateAIReport = async () => {
    setGeneratingReport(true);
    
    // Simulate AI report generation
    setTimeout(() => {
      const insights = user?.businessType === 'medical' 
        ? `**AI Business Insights for ${user.businessName}**

📊 **Performance Summary**
Your pharmacy has shown strong performance this month with a 15% increase in sales compared to last month. Fever medicines continue to be your top category, representing 35% of total sales.

🔍 **Key Findings**
• Paracetamol 500mg is your best-selling item with 145 units sold
• Cough medicine sales increased by 23% due to seasonal demand
• Vitamin D3 shows high profit margins but low turnover
• First aid products have consistent steady sales

💡 **Recommendations**
1. **Stock Management**: Increase Paracetamol inventory by 20% for next month
2. **Seasonal Planning**: Prepare for continued cough medicine demand
3. **Promotion Strategy**: Create bundle offers with vitamins to increase turnover
4. **Supplier Relations**: Negotiate better rates for high-volume items

⚠️ **Alerts**
• Vitamin D3 stock is critically low (3 units remaining)
• Consider diversifying the vitamin category with more popular supplements
• Monitor competitor pricing for cough syrups in your area

📈 **Growth Opportunities**
Focus on expanding your vitamin and supplement section, as this category shows the highest profit margins (32% average) but represents only 20% of your sales volume.`
        : `**AI Business Insights for ${user.businessName}**

📊 **Performance Summary**
Your ice cream business has demonstrated excellent seasonal performance with a 22% increase in sales this month. Cornetto products lead your sales, accounting for 30% of total revenue.

🔍 **Key Findings**
• Vanilla Cornetto is your star product with 234 units sold
• Bar category showing strong growth with 25% market share
• Cup products maintain steady sales throughout the day
• Kulfi products have untapped potential with high profit margins

💡 **Recommendations**
1. **Seasonal Strategy**: Increase Cornetto and Bar inventory for peak summer months
2. **Product Mix**: Introduce more Kulfi varieties to boost high-margin sales
3. **Peak Hours**: Stock more Cup products for afternoon rush periods
4. **Cross-selling**: Bundle slower-moving items with popular products

⚠️ **Alerts**
• Chocolate Bar stock needs immediate replenishment (6 units remaining)
• Monitor temperature control systems during peak summer
• Consider premium product lines for higher margins

📈 **Growth Opportunities**
The Kulfi category shows the highest profit margins (40% average) but only represents 20% of sales. Expanding this category could significantly boost profitability.`;

      setAiInsights(insights);
      setGeneratingReport(false);
    }, 3000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-1">Analytics and insights for your business</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={generateAIReport}
              disabled={generatingReport}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Brain className="h-4 w-4 mr-2" />
              {generatingReport ? 'Generating...' : 'AI Insights'}
            </Button>
          </div>
        </div>

        {/* AI Insights */}
        {aiInsights && (
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Zap className="h-5 w-5" />
                AI-Generated Business Report
              </CardTitle>
              <CardDescription>
                Intelligent analysis of your business performance and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {aiInsights}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reports Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Sales Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Sales & Profit</CardTitle>
                  <CardDescription>Revenue and profit trends over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                      <Bar dataKey="profit" fill="#10b981" name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Distribution of sales across product categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Your best performing products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSellingItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.sales} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${item.revenue.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {user?.businessType === 'medical' ? '342' : '156'}
                  </div>
                  <p className="text-sm text-gray-500">in inventory</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {categoryData.length}
                  </div>
                  <p className="text-sm text-gray-500">product categories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Avg. Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">28%</div>
                  <p className="text-sm text-gray-500">profit margin</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Daily sales performance over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Sales"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Profit"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
