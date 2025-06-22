
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield } from 'lucide-react';

export const MedicalDisclaimer = () => {
  return (
    <Alert className="mb-6 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg">
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <AlertDescription className="text-amber-800 font-medium">
        <div className="flex items-start gap-3">
          <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="space-y-2 text-sm">
            <p className="font-semibold">MEDICAL DISCLAIMER</p>
            <p>
              This application is intended for use by trained Emergency Medical Services professionals only. 
              The information provided is for reference purposes and should not replace clinical judgment, 
              local protocols, or medical direction.
            </p>
            <p className="text-xs">
              Always verify dosing calculations and follow your local medical director's guidelines. 
              Not intended for general public medical advice.
            </p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
