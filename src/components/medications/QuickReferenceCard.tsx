
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
    <Card className="bg-white border border-gray-200 shadow-lg print:shadow-none print:border-2 print:border-black">
      <CardHeader className="border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <CardTitle className="text-xl font-semibold flex items-start gap-3 min-w-0 flex-1">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {medication.high_alert && (
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
              )}
              <span className="break-words leading-tight">{medication.medication_name}</span>
            </div>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="print:hidden flex-shrink-0 border-gray-300 hover:bg-gray-50"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
        
        {medication.classification && medication.classification.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {medication.classification.slice(0, 3).map((cls, index) => (
              <Badge key={index} variant="secondary" className="text-sm bg-gray-100 text-gray-700 border-0 px-3 py-1">
                {cls}
              </Badge>
            ))}
            {medication.classification.length > 3 && (
              <Badge variant="secondary" className="text-sm bg-gray-100 text-gray-600 border-0 px-2 py-1">
                +{medication.classification.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {dosing.map((dose) => {
            const pumpSettings = dose.infusion_pump_settings as any;
            const hasValidPumpSettings = dose.requires_infusion_pump && pumpSettings && (
              pumpSettings.medication_selection ||
              pumpSettings.cca_setting ||
              pumpSettings.line_option ||
              pumpSettings.duration ||
              pumpSettings.vtbi ||
              pumpSettings.pump_instructions
            );
            
            return (
              <div key={dose.id} className="border border-gray-200 rounded-lg p-5 print:break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <h4 className="text-lg font-medium text-gray-900">{dose.patient_type}</h4>
                  <div className="flex flex-wrap gap-2">
                    {dose.route && (
                      <Badge variant="outline" className="border-gray-300 text-gray-700 text-sm">
                        {dose.route}
                      </Badge>
                    )}
                    {hasValidPumpSettings && (
                      <Badge variant="outline" className="flex items-center gap-2 text-blue-700 border-blue-300 text-sm">
                        <Syringe className="h-4 w-4" />
                        IV Pump
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm mb-4 text-gray-700">{dose.indication}</p>
                
                {/* Dose - Primary Focus */}
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-900 p-4 border-2 border-red-200 rounded-lg bg-red-50">
                    {dose.dose}
                  </div>
                  {dose.concentration_supplied && (
                    <p className="text-sm text-gray-600 mt-2 font-medium">
                      Concentration: {dose.concentration_supplied}
                    </p>
                  )}
                </div>
                
                {/* Simplified Pump Settings - Only Essential Info */}
                {hasValidPumpSettings && (
                  <div className="mt-4 p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="font-medium text-blue-800 mb-2 flex items-center gap-2 text-sm">
                      <Syringe className="h-4 w-4" />
                      IV Pump Settings
                    </div>
                    
                    {pumpSettings.medication_selection && (
                      <div className="mb-2 font-medium text-blue-900 text-sm">
                        {pumpSettings.medication_selection}
                      </div>
                    )}

                    <div className="text-sm text-blue-800 space-y-1">
                      {pumpSettings.cca_setting && <div>CCA: {pumpSettings.cca_setting}</div>}
                      {pumpSettings.line_option && <div>Line: {pumpSettings.line_option}</div>}
                      {pumpSettings.duration && <div>Duration: {pumpSettings.duration}</div>}
                      {pumpSettings.vtbi && <div>VTBI: {pumpSettings.vtbi}</div>}
                      {pumpSettings.pump_instructions && (
                        <div className="pt-2 border-t border-blue-200 italic">
                          {pumpSettings.pump_instructions}
                        </div>
                      )}
                    </div>
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
