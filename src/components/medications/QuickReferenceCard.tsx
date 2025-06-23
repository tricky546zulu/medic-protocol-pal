
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
            {medication.classification.map((cls, index) => (
              <Badge key={index} variant="secondary" className="text-sm bg-gray-100 text-gray-700 border-0 px-3 py-1">
                {cls}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {dosing.map((dose) => {
            const pumpSettings = dose.infusion_pump_settings as any;
            
            return (
              <div key={dose.id} className="border border-gray-200 rounded-lg p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <h4 className="text-lg font-medium text-gray-900">{dose.patient_type}</h4>
                  <div className="flex flex-wrap gap-2">
                    {dose.route && (
                      <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-700 text-sm">
                        {dose.route}
                      </Badge>
                    )}
                    {dose.requires_infusion_pump && (
                      <Badge variant="outline" className="flex items-center gap-2 text-blue-700 border-blue-300 bg-blue-50 text-sm">
                        <Syringe className="h-4 w-4" />
                        IV Pump
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm mb-4 text-gray-700">{dose.indication}</p>
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="font-semibold text-xl text-center text-red-900">{dose.dose}</p>
                </div>
                
                {dose.concentration_supplied && (
                  <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 border border-gray-200 rounded">
                    Concentration: {dose.concentration_supplied}
                  </p>
                )}
                
                {dose.requires_infusion_pump && pumpSettings && Object.keys(pumpSettings).length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                    <div className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                      <Syringe className="h-4 w-4" />
                      IV Pump Settings
                    </div>
                    
                    {pumpSettings.medication_selection && (
                      <div className="mb-3 p-3 bg-white border border-blue-200 rounded">
                        <span className="font-medium text-blue-900">Pump Medication:</span>
                        <div className="font-medium text-blue-900 mt-1">{pumpSettings.medication_selection}</div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {pumpSettings.cca_setting && (
                        <div className="bg-white p-3 border border-blue-100 rounded">
                          <span className="font-medium text-sm">CCA:</span>{' '}
                          <span className="text-sm">{pumpSettings.cca_setting}</span>
                        </div>
                      )}
                      {pumpSettings.line_option && (
                        <div className="bg-white p-3 border border-blue-100 rounded">
                          <span className="font-medium text-sm">Line:</span>{' '}
                          <span className="text-sm">{pumpSettings.line_option}</span>
                        </div>
                      )}
                      {pumpSettings.duration && (
                        <div className="bg-white p-3 border border-blue-100 rounded">
                          <span className="font-medium text-sm">Duration:</span>{' '}
                          <span className="text-sm">{pumpSettings.duration}</span>
                        </div>
                      )}
                      {pumpSettings.vtbi && (
                        <div className="bg-white p-3 border border-blue-100 rounded">
                          <span className="font-medium text-sm">VTBI:</span>{' '}
                          <span className="text-sm">{pumpSettings.vtbi}</span>
                        </div>
                      )}
                    </div>
                    
                    {pumpSettings.pump_instructions && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <span className="font-medium text-sm">Instructions:</span>{' '}
                        <span className="text-sm">{pumpSettings.pump_instructions}</span>
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
