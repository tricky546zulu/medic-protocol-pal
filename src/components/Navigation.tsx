
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PillIcon, ShieldCheckIcon, HomeIcon, MenuIcon, XIcon, LogOutIcon, UserCircle2Icon, HeartIcon, BriefcaseMedicalIcon } from 'lucide-react'; // Updated icons
import { useAuth } from '@/contexts/AuthContext';
import { cn } from "@/lib/utils"; // Import cn utility

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut, isLoading } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/medications', label: 'Medications', icon: BriefcaseMedicalIcon }, // Changed Pill to BriefcaseMedicalIcon
    ...(user ? [
      { path: '/favorites', label: 'Favorites', icon: HeartIcon },
      { path: '/admin', label: 'Admin', icon: ShieldCheckIcon } // Changed Shield to ShieldCheckIcon
    ] : []),
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/'); // Navigate to home after sign out
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const NavLinkButton = ({ path, label, icon: Icon, currentPath, isMobile = false, onClick }: any) => (
    <Button
      variant={isActive(path) ? (isMobile ? 'secondary' : 'default') : 'ghost'}
      className={cn(
        "transition-all duration-200",
        isMobile ? "w-full justify-start text-base min-h-[48px]" : "rounded-md", // Updated: rounded-md from rounded-lg
        isActive(path) && !isMobile && "shadow-sm" // Softer shadow for active desktop links
      )}
      asChild
      onClick={onClick}
    >
      <Link to={path} className={cn("flex items-center gap-2", isMobile && "gap-3 py-2")}>
        <Icon className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
        {label}
      </Link>
    </Button>
  );


  const commonNavClasses = "bg-background/90 backdrop-blur-md shadow-sm border-b border-border sticky top-0 z-50";
  const commonContainerClasses = "container mx-auto px-4";
  const commonFlexBetweenClasses = "flex items-center justify-between h-16"; // Standard h-16 for nav height

  if (isLoading) {
    return (
      <nav className={commonNavClasses}>
        <div className={commonContainerClasses}>
          <div className={commonFlexBetweenClasses}>
            <Link to="/" className="flex items-center gap-3 font-bold text-xl text-primary">
              <div className="p-2 bg-primary/10 rounded-md"> {/* Updated: rounded-md from rounded-lg */}
                <BriefcaseMedicalIcon className="h-5 w-5 text-primary" /> {/* Updated Icon */}
              </div>
              SK EMS Meds
            </Link>
            {/* Skeleton loader for user area could be added here if needed */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-20 bg-muted rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={commonNavClasses}>
      <div className={commonContainerClasses}>
        <div className={commonFlexBetweenClasses}>
          <Link to="/" className="flex items-center gap-3 font-bold text-xl text-primary hover:text-primary/90 transition-colors">
            <div className="p-2 bg-primary/10 rounded-md"> {/* Updated: rounded-md from rounded-lg */}
              <BriefcaseMedicalIcon className="h-5 w-5 text-primary" /> {/* Updated Icon */}
            </div>
            SK EMS Meds
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLinkButton
                key={link.path}
                path={link.path}
                label={link.label}
                icon={link.icon}
                currentPath={location.pathname}
              />
            ))}
            
            {user ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border"> {/* Reduced margin, use border-border */}
                <div className="flex items-center gap-2 text-sm text-foreground bg-secondary px-3 py-2 rounded-md"> {/* Use foreground, secondary, rounded-md */}
                  <UserCircle2Icon className="h-4 w-4 text-muted-foreground" /> {/* Updated Icon & color */}
                  <span className="max-w-32 truncate">{user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors"> {/* Use destructive theme for sign out */}
                  <LogOutIcon className="h-4 w-4 mr-2" /> {/* Updated Icon and margin */}
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button asChild className="ml-4" variant="default"> {/* Reduced margin, ensure default variant */}
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
              className="min-h-[44px] min-w-[44px] touch-manipulation rounded-md hover:bg-accent" // Use accent for hover, rounded-md
            >
              {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/90 backdrop-blur-md border-t border-border shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map(link => (
               <NavLinkButton
                key={link.path}
                path={link.path}
                label={link.label}
                icon={link.icon}
                currentPath={location.pathname}
                isMobile={true}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
            
            {user ? (
              <div className="pt-4 mt-2 border-t border-border space-y-3"> {/* Added mt-2, space-y-3 */}
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-foreground bg-secondary rounded-md"> {/* Use foreground, secondary, rounded-md */}
                  <UserCircle2Icon className="h-5 w-5 text-muted-foreground" /> {/* Updated Icon & color */}
                  <span className="truncate">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[48px] touch-manipulation rounded-md gap-3 py-2" // Use destructive theme, rounded-md
                  onClick={handleSignOut}
                >
                  <LogOutIcon className="h-5 w-5" /> {/* Updated Icon, removed mr-3 as gap is used */}
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="pt-4 mt-2 border-t border-border"> {/* Added mt-2 */}
                <Button
                  variant="default" // Ensure default variant
                  className="w-full min-h-[48px] touch-manipulation rounded-md" // rounded-md
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
