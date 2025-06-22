
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock } from 'lucide-react';

export const DataProtectionNotice = () => {
  return (
    <Alert className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 shadow-lg">
      <Shield className="h-5 w-5 text-blue-600" />
      <AlertDescription className="text-blue-800 font-medium">
        <div className="flex items-start gap-3">
          <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="space-y-2 text-sm">
            <p className="font-semibold">DATA PROTECTION NOTICE</p>
            <p>
              This administrative panel is secured with role-based access controls. 
              All medication data modifications are logged and audited.
            </p>
            <p className="text-xs">
              Only authorized personnel should access this section. 
              Unauthorized access or modification of medical protocols may result in patient safety risks.
            </p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
