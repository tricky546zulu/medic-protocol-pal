
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, AlertTriangle, Syringe } from 'lucide-react';
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
    <Card className="border-0 shadow-lg bg-white rounded-xl print:shadow-none print:border-2 print:border-black">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 min-w-0 flex-1">
            {medication.high_alert && (
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
            )}
            <span className="truncate">{medication.medication_name}</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="print:hidden flex-shrink-0 h-9 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <Printer className="h-3 w-3 mr-2" />
            Print
          </Button>
        </div>
        
        {medication.classification && medication.classification.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {medication.classification.map((cls, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                {cls}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {dosing.map((dose) => {
            const pumpSettings = dose.infusion_pump_settings as any;
            
            return (
              <div key={dose.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3 gap-3">
                  <h4 className="text-sm font-semibold truncate">{dose.patient_type}</h4>
                  <div className="flex gap-2 flex-shrink-0">
                    {dose.route && (
                      <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-700 text-xs">{dose.route}</Badge>
                    )}
                    {dose.requires_infusion_pump && (
                      <Badge variant="outline" className="flex items-center gap-1 text-blue-700 border-blue-300 bg-blue-50 text-xs">
                        <Syringe className="h-3 w-3" />
                        IV Pump
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs mb-2 break-words text-gray-600">{dose.indication}</p>
                <p className="font-bold text-lg mb-2 break-words">{dose.dose}</p>
                {dose.concentration_supplied && (
                  <p className="text-xs text-gray-600 break-words">
                    Concentration: {dose.concentration_supplied}
                  </p>
                )}
                {dose.requires_infusion_pump && pumpSettings && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs">
                    <div className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                      <Syringe className="h-3 w-3" />
                      ⚠️ IV PUMP SETTINGS:
                    </div>
                    
                    {pumpSettings.medication_selection && (
                      <div className="mb-2 p-2 bg-blue-100 rounded-lg">
                        <span className="font-semibold text-blue-800 text-xs">PUMP MEDICATION:</span>
                        <div className="font-semibold text-blue-900 break-words text-xs">{pumpSettings.medication_selection}</div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {pumpSettings.cca_setting && (
                        <div className="bg-white p-2 rounded-lg">
                          <span className="font-medium text-xs">CCA:</span> <span className="break-words text-xs">{pumpSettings.cca_setting}</span>
                        </div>
                      )}
                      {pumpSettings.line_option && (
                        <div className="bg-white p-2 rounded-lg">
                          <span className="font-medium text-xs">Line:</span> <span className="break-words text-xs">{pumpSettings.line_option}</span>
                        </div>
                      )}
                      {pumpSettings.duration && (
                        <div className="bg-white p-2 rounded-lg">
                          <span className="font-medium text-xs">Duration:</span> <span className="break-words text-xs">{pumpSettings.duration}</span>
                        </div>
                      )}
                      {pumpSettings.vtbi && (
                        <div className="bg-white p-2 rounded-lg">
                          <span className="font-medium text-xs">VTBI:</span> <span className="break-words text-xs">{pumpSettings.vtbi}</span>
                        </div>
                      )}
                    </div>
                    {pumpSettings.pump_instructions && (
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <span className="font-medium text-xs">Instructions:</span> <span className="break-words text-xs">{pumpSettings.pump_instructions}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
