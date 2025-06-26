
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const MedicalDisclaimer = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          <p className="font-medium mb-1">MEDICAL DISCLAIMER</p>
          <p className="text-xs">
            This application is intended for use by trained Emergency Medical Services professionals only. 
            Information provided is for reference and should not replace clinical judgment or local protocols. 
            Always verify dosing and follow your medical director's guidelines.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};
