
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
    <Card className="bg-white border border-gray-200 shadow-lg print:shadow-none print:border-2 print:border-black">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            {medication.high_alert && (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <span>{medication.medication_name}</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="print:hidden"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
        
        {medication.classification && medication.classification.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {medication.classification.slice(0, 3).map((cls, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {cls}
              </Badge>
            ))}
            {medication.classification.length > 3 && (
              <Badge variant="secondary" className="text-sm">
                +{medication.classification.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {dosing.map((dose) => (
            <div key={dose.id} className="border border-gray-200 rounded-lg p-4 print:break-inside-avoid">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-medium text-gray-900">{dose.patient_type}</h4>
                {dose.route && (
                  <Badge variant="outline" className="text-gray-700">
                    {dose.route}
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-gray-700 mb-3">{dose.indication}</div>
              
              {/* Simplified Print-Friendly Dose */}
              <div className="text-center p-3 bg-gray-50 rounded border">
                <div className="text-xl font-bold text-gray-900">
                  {dose.dose}
                </div>
                {dose.concentration_supplied && (
                  <div className="text-sm text-gray-600 mt-1">
                    {dose.concentration_supplied}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
