
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, AlertTriangle } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Medication = Database['public']['Tables']['medications']['Row'];
type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface QuickReferenceCardProps {
  medication: Medication;
  dosing: MedicationDosing[];
}

export const QuickReferenceCard = ({ medication, dosing }: QuickReferenceCardProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="med-card print:shadow-none print:border-2 print:border-black">
      <div className="med-card-header print:border-b-2 print:border-black">
        <div className="min-w-0 flex-1">
          <h1 className="med-title flex items-center gap-3">
            {medication.high_alert && (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            )}
            <span>{medication.medication_name}</span>
          </h1>
          
          {medication.classification && medication.classification.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {medication.classification.slice(0, 3).map((cls, index) => (
                <span key={index} className="med-category-tag">
                  {cls}
                </span>
              ))}
              {medication.classification.length > 3 && (
                <span className="med-category-tag bg-gray-500">
                  +{medication.classification.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          onClick={handlePrint}
          className="print:hidden h-11 px-6 border-gray-300 hover:bg-gray-50"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>
      
      <div className="space-y-6">
        {dosing.map((dose) => (
          <div key={dose.id} className="med-section print:break-inside-avoid">
            <div className="flex items-center justify-between mb-4">
              <h4 className="med-section-title">{dose.patient_type}</h4>
              {dose.route && (
                <span className="med-category-tag">
                  {dose.route}
                </span>
              )}
            </div>
            
            <div className="med-body-text mb-4 text-gray-700">{dose.indication}</div>
            
            {/* Simplified Print-Friendly Dose */}
            <div className="text-center p-6 bg-gray-50 rounded-lg border-l-4 border-gray-400">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {dose.dose}
              </div>
              {dose.concentration_supplied && (
                <div className="med-body-text text-gray-600">
                  {dose.concentration_supplied}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
