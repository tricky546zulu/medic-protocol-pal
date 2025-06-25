
import React from 'react';
import { Info } from 'lucide-react'; // Replaced AlertTriangle with Info

export const MedicalDisclaimer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-6 px-4 mt-8"> {/* Added mt-8 for spacing */}
      <div className="container mx-auto flex items-start text-sm">
        <Info className="h-5 w-5 mr-3 mt-1 text-gray-500 flex-shrink-0" /> {/* Adjusted icon styling */}
        <div>
          <p className="font-semibold mb-1">MEDICAL DISCLAIMER</p>
          <p className="text-xs leading-relaxed">
            This application is intended for use by trained Emergency Medical Services professionals only. 
            Information provided is for reference and should not replace clinical judgment or local protocols. 
            Always verify dosing and follow your medical director's guidelines.
          </p>
        </div>
      </div>
    </footer>
  );
};
