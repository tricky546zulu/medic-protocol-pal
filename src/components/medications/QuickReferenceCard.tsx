
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
    <Card className="print:shadow-none print:border-2 print:border-black">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            {medication.high_alert && (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            {medication.medication_name}
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
          <div className="flex flex-wrap gap-1 mt-2">
            {medication.classification.map((cls, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {cls}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {dosing.map((dose) => {
            const pumpSettings = dose.infusion_pump_settings as any;
            
            return (
              <div key={dose.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{dose.patient_type}</h4>
                  <div className="flex gap-1">
                    {dose.route && (
                      <Badge variant="outline">{dose.route}</Badge>
                    )}
                    {dose.requires_infusion_pump && (
                      <Badge variant="outline" className="flex items-center gap-1 text-blue-700">
                        <Syringe className="h-3 w-3" />
                        IV Pump
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm mb-1">{dose.indication}</p>
                <p className="font-bold text-lg">{dose.dose}</p>
                {dose.concentration_supplied && (
                  <p className="text-sm text-gray-600">
                    Concentration: {dose.concentration_supplied}
                  </p>
                )}
                {dose.requires_infusion_pump && pumpSettings && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                    <div className="font-semibold text-blue-700 mb-1 flex items-center gap-1">
                      <Syringe className="h-3 w-3" />
                      IV Pump Settings:
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {pumpSettings.cca_setting && (
                        <div><span className="font-medium">CCA:</span> {pumpSettings.cca_setting}</div>
                      )}
                      {pumpSettings.line_option && (
                        <div><span className="font-medium">Line:</span> {pumpSettings.line_option}</div>
                      )}
                      {pumpSettings.duration && (
                        <div><span className="font-medium">Duration:</span> {pumpSettings.duration}</div>
                      )}
                      {pumpSettings.vtbi && (
                        <div><span className="font-medium">VTBI:</span> {pumpSettings.vtbi}</div>
                      )}
                    </div>
                    {pumpSettings.pump_instructions && (
                      <div className="mt-1 pt-1 border-t border-blue-200">
                        <span className="font-medium">Instructions:</span> {pumpSettings.pump_instructions}
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
