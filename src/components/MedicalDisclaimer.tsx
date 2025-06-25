
import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export const MedicalDisclaimer = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <Info className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-600 leading-relaxed">
          <p className="font-medium text-gray-700 mb-1">Medical Disclaimer</p>
          <p>
            This application provides reference information for emergency medical services protocols. 
            Always follow your local medical director's guidelines and current protocol publications. 
            This tool is not a substitute for proper medical training and clinical judgment.
          </p>
        </div>
      </div>
    </div>
  );
};
