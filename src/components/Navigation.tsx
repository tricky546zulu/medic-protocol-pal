
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pill, Shield, Home } from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Pill className="h-6 w-6" />
            SK EMS Meds
          </Link>
          
          <div className="flex items-center gap-4">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              asChild
            >
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Link>
            </Button>
            
            <Button
              variant={isActive('/medications') ? 'default' : 'ghost'}
              asChild
            >
              <Link to="/medications" className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Medications
              </Link>
            </Button>
            
            <Button
              variant={isActive('/admin') ? 'default' : 'ghost'}
              asChild
            >
              <Link to="/admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
