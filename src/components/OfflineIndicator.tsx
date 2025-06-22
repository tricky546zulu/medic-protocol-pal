
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 flex justify-center">
      <Badge variant="destructive" className="flex items-center gap-2 px-4 py-2 text-sm">
        <WifiOff className="h-4 w-4" />
        You're offline - Some features may be limited
      </Badge>
    </div>
  );
};
