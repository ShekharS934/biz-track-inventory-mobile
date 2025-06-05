
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  FileText, 
  LogOut,
  Menu,
  X,
  Users,
  Home
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock user data for demo purposes
  const mockUser = {
    name: 'Demo User',
    role: 'owner' as const,
    businessType: 'ice_cream' as const,
    businessName: 'Sweet Dreams Ice Cream'
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Sales', href: '/sales', icon: TrendingUp },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Vendors', href: '/vendors', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    // For demo, just redirect to auth page
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-md shadow-soft transform transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Home className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-slate-800">BizTrack</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden touch-target hover:bg-slate-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-4 py-6 space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm font-medium text-slate-800">{mockUser.name}</p>
            <p className="text-xs text-slate-500 capitalize">{mockUser.role}</p>
            <p className="text-xs text-slate-600 font-medium">{mockUser.businessName}</p>
          </div>

          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 touch-target ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200/60">
          <Button
            variant="ghost"
            className="w-full touch-target hover:bg-red-50 hover:text-red-600 transition-colors"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/60">
          <div className="flex items-center justify-between h-16 px-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden touch-target hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1" />
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
