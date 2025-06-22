
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
    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl print:shadow-none print:border-2 print:border-black">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2 min-w-0 flex-1">
            {medication.high_alert && (
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
            )}
            <span className="truncate">{medication.medication_name}</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="print:hidden flex-shrink-0 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
        
        {medication.classification && medication.classification.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {medication.classification.map((cls, index) => (
              <Badge key={index} variant="secondary" className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">
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
              <div key={dose.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4 gap-4">
                  <h4 className="text-lg font-semibold truncate">{dose.patient_type}</h4>
                  <div className="flex gap-2 flex-shrink-0">
                    {dose.route && (
                      <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-700">{dose.route}</Badge>
                    )}
                    {dose.requires_infusion_pump && (
                      <Badge variant="outline" className="flex items-center gap-1 text-blue-700 border-blue-300 bg-blue-50">
                        <Syringe className="h-3 w-3" />
                        IV Pump
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm mb-3 break-words">{dose.indication}</p>
                <p className="font-bold text-xl md:text-2xl mb-3 break-words">{dose.dose}</p>
                {dose.concentration_supplied && (
                  <p className="text-sm text-gray-600 break-words">
                    Concentration: {dose.concentration_supplied}
                  </p>
                )}
                {dose.requires_infusion_pump && pumpSettings && (
                  <div className="mt-4 p-4 bg-blue-50/95 backdrop-blur-sm border-0 shadow-xl rounded-2xl text-sm">
                    <div className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                      <Syringe className="h-4 w-4" />
                      ⚠️ IV PUMP SETTINGS:
                    </div>
                    
                    {pumpSettings.medication_selection && (
                      <div className="mb-3 p-3 bg-blue-100/95 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
                        <span className="font-bold text-blue-800">PUMP MEDICATION:</span>
                        <div className="font-semibold text-blue-900 break-words">{pumpSettings.medication_selection}</div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {pumpSettings.cca_setting && (
                        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl border-0 shadow-lg">
                          <span className="font-medium">CCA:</span> <span className="break-words">{pumpSettings.cca_setting}</span>
                        </div>
                      )}
                      {pumpSettings.line_option && (
                        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl border-0 shadow-lg">
                          <span className="font-medium">Line:</span> <span className="break-words">{pumpSettings.line_option}</span>
                        </div>
                      )}
                      {pumpSettings.duration && (
                        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl border-0 shadow-lg">
                          <span className="font-medium">Duration:</span> <span className="break-words">{pumpSettings.duration}</span>
                        </div>
                      )}
                      {pumpSettings.vtbi && (
                        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl border-0 shadow-lg">
                          <span className="font-medium">VTBI:</span> <span className="break-words">{pumpSettings.vtbi}</span>
                        </div>
                      )}
                    </div>
                    {pumpSettings.pump_instructions && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <span className="font-medium">Instructions:</span> <span className="break-words">{pumpSettings.pump_instructions}</span>
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
