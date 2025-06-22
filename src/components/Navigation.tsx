
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pill, Shield, Home, Menu, X, LogOut, User, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut, isLoading } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/medications', label: 'Medications', icon: Pill },
    ...(user ? [
      { path: '/favorites', label: 'My Favorites', icon: Heart },
      { path: '/admin', label: 'Admin', icon: Shield }
    ] : []),
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <Pill className="h-6 w-6" />
              SK EMS Meds
            </Link>
            <div>Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

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
            
            {user ? (
              <div className="flex items-center gap-2 ml-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  {user.email}
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button asChild className="ml-4">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              className="min-h-[44px] min-w-[44px] touch-manipulation"
            >
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
                variant={isActive(link.path) ? 'secondary' : 'ghost'}
                className="w-full justify-start min-h-[48px] touch-manipulation"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to={link.path} className="flex items-center gap-3 py-2 text-base">
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              </Button>
            ))}
            
            {user ? (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  {user.email}
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[48px] touch-manipulation"
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="pt-2 border-t">
                <Button
                  className="w-full min-h-[48px] touch-manipulation"
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to="/auth">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
