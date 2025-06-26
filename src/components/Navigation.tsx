
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pill, Shield, Home, Menu, X, LogOut, User, Heart, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MedicationSearch } from '@/components/medications/MedicationSearch';
import { useMedicationSearch as useSearchHook } from '@/hooks/useMedicationSearch'; // Renamed import

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  // Static suggestions are kept here for now, but ideally would come from a service or context
  const [suggestions, setSuggestions] = useState<string[]>(['Aspirin', 'Acetaminophen', 'Ibuprofen']);
  const [indicationSuggestions, setIndicationSuggestions] = useState<Array<{ text: string; medicationId: string }>>([
    { text: 'Headache', medicationId: '1' },
    { text: 'Fever', medicationId: '2' },
  ]);

  // Removed the local instance of searchHook as MedicationSearch manages its own.
  // If Navigation needs to react to search actions (e.g. navigate),
  // MedicationSearch can expose callbacks.

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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // searchHook.handleSearchChange(value); // If searchHook manages state internally
  };

  if (isLoading) {
    return (
      <nav className="bg-header text-header-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 font-bold text-xl">
              <Pill className="h-6 w-6" />
              SK EMS Meds
            </Link>
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-header text-header-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity">
            {/* Icon can be removed if title is prominent enough, or kept for branding */}
            {/* <Pill className="h-6 w-6" />  */}
            SK EMS Meds
          </Link>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-grow max-w-xl ml-4">
            <MedicationSearch
              value={searchTerm}
              onChange={handleSearchChange}
              suggestions={suggestions} // Pass actual suggestions
              indicationSuggestions={indicationSuggestions} // Pass actual indication suggestions
              // isLoading prop is managed by MedicationSearch's internal hook
            />
          </div>

          {/* Desktop Navigation Links & Auth */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {navLinks.map(link => (
              <Button
                key={link.path}
                variant="ghost" // Changed to ghost to better suit header background
                className={`
                  ${isActive(link.path) ? 'bg-white/20' : 'hover:bg-white/10'}
                  text-header-foreground rounded-lg transition-all duration-200
                `}
                asChild
              >
                <Link to={link.path} className="flex items-center gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
            
            {user ? (
              <div className="flex items-center gap-3 ml-6 pl-6 border-l border-header-foreground/30">
                <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-white/10">
                  <User className="h-4 w-4" />
                  <span className="max-w-32 truncate">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="hover:bg-red-500/80 hover:text-white transition-all duration-200 text-header-foreground"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                asChild
                className="ml-6 bg-white/20 hover:bg-white/30 text-header-foreground shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto"> {/* Ensure it's pushed to the right */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              className="min-h-[44px] min-w-[44px] touch-manipulation hover:bg-white/10 text-header-foreground rounded-lg"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Search Bar - Mobile (below header items, above mobile menu) */}
        <div className="md:hidden px-4 pb-3 pt-1">
          <MedicationSearch
            value={searchTerm}
            onChange={handleSearchChange}
            suggestions={suggestions}
            indicationSuggestions={indicationSuggestions}
            // isLoading prop is managed by MedicationSearch's internal hook
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-header text-header-foreground border-t border-header-foreground/30 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map(link => (
              <Button
                key={link.path}
                variant={isActive(link.path) ? 'default' : 'ghost'} // Default could be bg-white/20
                className={`
                  w-full justify-start min-h-[48px] touch-manipulation rounded-lg
                  ${isActive(link.path) ? 'bg-white/20' : 'hover:bg-white/10'}
                  text-header-foreground
                `}
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
              <div className="pt-4 border-t border-header-foreground/30 space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-white/10">
                  <User className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-300 hover:text-red-100 hover:bg-red-500/50 min-h-[48px] touch-manipulation rounded-lg"
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
              <div className="pt-4 border-t border-header-foreground/30">
                <Button
                  className="w-full min-h-[48px] touch-manipulation rounded-lg shadow-md bg-white/20 hover:bg-white/30 text-header-foreground"
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
