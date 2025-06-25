
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
      { path: '/favorites', label: 'Favorites', icon: Heart },
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
      <nav className="bg-blue-600 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 font-bold text-xl text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                <Pill className="h-5 w-5" />
              </div>
              SK EMS Meds
            </Link>
            <div className="animate-pulse text-blue-100">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-blue-600 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl text-white hover:text-blue-100 transition-colors">
            <div className="p-2 bg-white/20 rounded-lg">
              <Pill className="h-5 w-5" />
            </div>
            SK EMS Meds
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Button
                key={link.path}
                variant={isActive(link.path) ? 'secondary' : 'ghost'}
                className={`${
                  isActive(link.path) 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'text-white hover:bg-white/10'
                } rounded-lg transition-all duration-200`}
                asChild
              >
                <Link to={link.path} className="flex items-center gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
            
            {user ? (
              <div className="flex items-center gap-3 ml-6 pl-6 border-l border-white/20">
                <div className="flex items-center gap-2 text-sm text-white bg-white/10 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4" />
                  <span className="max-w-32 truncate">{user.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut} 
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                asChild 
                className="ml-6 bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-200"
              >
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
              className="min-h-[44px] min-w-[44px] touch-manipulation text-white hover:bg-white/10 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700 border-t border-blue-500 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map(link => (
              <Button
                key={link.path}
                variant={isActive(link.path) ? 'secondary' : 'ghost'}
                className={`w-full justify-start min-h-[48px] touch-manipulation rounded-lg ${
                  isActive(link.path) 
                    ? 'bg-white text-blue-600' 
                    : 'text-white hover:bg-white/10'
                }`}
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
              <div className="pt-4 border-t border-blue-500 space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-white/10 rounded-lg">
                  <User className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:text-red-200 hover:bg-white/10 min-h-[48px] touch-manipulation rounded-lg"
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
              <div className="pt-4 border-t border-blue-500">
                <Button
                  className="w-full min-h-[48px] touch-manipulation rounded-lg bg-white text-blue-600 hover:bg-blue-50 shadow-md"
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
