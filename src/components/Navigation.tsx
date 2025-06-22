
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
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 font-bold text-xl text-primary">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Pill className="h-5 w-5" />
              </div>
              SK EMS Meds
            </Link>
            <div className="animate-pulse text-gray-500">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl text-primary hover:text-primary/80 transition-colors">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Pill className="h-5 w-5" />
            </div>
            SK EMS Meds
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Button
                key={link.path}
                variant={isActive(link.path) ? 'default' : 'ghost'}
                className={`${isActive(link.path) ? 'shadow-md' : 'hover:bg-gray-50'} rounded-lg transition-all duration-200`}
                asChild
              >
                <Link to={link.path} className="flex items-center gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
            
            {user ? (
              <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4" />
                  <span className="max-w-32 truncate">{user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200">
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button asChild className="ml-6 shadow-md hover:shadow-lg transition-all duration-200">
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
              className="min-h-[44px] min-w-[44px] touch-manipulation hover:bg-gray-50 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map(link => (
              <Button
                key={link.path}
                variant={isActive(link.path) ? 'secondary' : 'ghost'}
                className="w-full justify-start min-h-[48px] touch-manipulation rounded-lg"
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
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[48px] touch-manipulation rounded-lg"
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
              <div className="pt-4 border-t border-gray-200">
                <Button
                  className="w-full min-h-[48px] touch-manipulation rounded-lg shadow-md"
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
