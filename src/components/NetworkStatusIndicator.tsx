
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export const NetworkStatusIndicator = () => {
  const { isOnline, connectionType } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <WifiOff className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <div className="flex items-center gap-2">
          <span className="font-medium">No internet connection</span>
          <span className="text-sm">
            You can still access previously loaded medications offline.
          </span>
        </div>
      </AlertDescription>
    </Alert>
  );
};
