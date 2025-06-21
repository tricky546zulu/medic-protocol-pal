
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pill, Shield, Home, Menu, X } from 'lucide-react'; // Added Menu and X icons

export const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/medications', label: 'Medications', icon: Pill },
    { path: '/admin', label: 'Admin', icon: Shield },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Pill className="h-6 w-6" />
            SK EMS Meds
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(link => (
              <Button
                key={link.path}
                variant={isActive(link.path) ? 'default' : 'ghost'}
                asChild
              >
                <Link to={link.path} className="flex items-center gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2 space-y-1">
            {navLinks.map(link => (
              <Button
                key={link.path}
                variant={isActive(link.path) ? 'secondary' : 'ghost'} // Use secondary for active on mobile for better UX
                className="w-full justify-start"
                asChild
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
              >
                <Link to={link.path} className="flex items-center gap-3 py-2 text-base">
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
