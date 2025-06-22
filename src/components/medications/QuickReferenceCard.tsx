
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
    <Card className="bg-white/85 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl shadow-violet-200/60 print:shadow-none print:border-2 print:border-black hover:shadow-2xl hover:shadow-violet-300/70 transition-all duration-300 ring-1 ring-violet-200/30 hover:ring-violet-300/50">
      <CardHeader className="p-8">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-xl font-bold flex items-center gap-4 min-w-0 flex-1">
            {medication.high_alert && (
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 shadow-2xl drop-shadow-lg" />
            )}
            <span className="break-words leading-tight">{medication.medication_name}</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="print:hidden flex-shrink-0 h-12 rounded-2xl bg-white/80 backdrop-blur-lg border border-violet-200/60 hover:border-violet-400/70 hover:bg-gradient-to-r hover:from-violet-50/90 hover:to-purple-100/80 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-violet-200/40"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
        
        {medication.classification && medication.classification.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-5">
            {medication.classification.map((cls, index) => (
              <Badge key={index} variant="secondary" className="text-sm bg-gradient-to-r from-violet-100/90 to-purple-200/80 text-violet-800 px-4 py-2 rounded-2xl border border-violet-200/60 backdrop-blur-lg hover:scale-105 hover:shadow-md hover:from-violet-200/90 hover:to-purple-300/80 transition-all duration-200 font-semibold">
                {cls}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="space-y-8">
          {dosing.map((dose) => {
            const pumpSettings = dose.infusion_pump_settings as any;
            
            return (
              <div key={dose.id} className="bg-gradient-to-br from-gray-50/90 to-white/80 rounded-3xl p-6 backdrop-blur-lg border border-gray-100/60 hover:shadow-lg transition-all duration-200 shadow-lg shadow-gray-200/50">
                <div className="flex items-center justify-between mb-5 gap-4">
                  <h4 className="text-lg font-bold break-words flex-1">{dose.patient_type}</h4>
                  <div className="flex gap-3 flex-shrink-0">
                    {dose.route && (
                      <Badge variant="outline" className="bg-white/80 border-gray-300/60 text-gray-800 text-sm px-3 py-2 rounded-2xl backdrop-blur-lg hover:bg-white hover:scale-105 transition-all duration-200 font-semibold">{dose.route}</Badge>
                    )}
                    {dose.requires_infusion_pump && (
                      <Badge variant="outline" className="flex items-center gap-2 text-blue-800 border-blue-300/60 bg-gradient-to-r from-blue-100/90 to-sky-200/80 text-sm px-3 py-2 rounded-2xl backdrop-blur-lg hover:scale-105 transition-all duration-200 font-semibold">
                        <Syringe className="h-4 w-4" />
                        IV Pump
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm mb-4 break-words text-gray-700 leading-relaxed font-medium">{dose.indication}</p>
                <div className="p-4 bg-white/90 rounded-2xl border border-white/60 mb-4 backdrop-blur-lg shadow-md shadow-gray-200/40">
                  <p className="font-bold text-xl break-words text-center">{dose.dose}</p>
                </div>
                {dose.concentration_supplied && (
                  <p className="text-sm text-gray-700 break-words mb-4 bg-white/70 p-3 rounded-2xl font-medium">
                    Concentration: {dose.concentration_supplied}
                  </p>
                )}
                {dose.requires_infusion_pump && pumpSettings && (
                  <div className="mt-5 p-6 bg-gradient-to-br from-blue-50/90 to-sky-100/80 rounded-3xl text-sm backdrop-blur-lg border border-blue-100/60 hover:shadow-lg transition-all duration-200 shadow-lg shadow-blue-200/50">
                    <div className="font-bold text-blue-800 mb-4 flex items-center gap-3">
                      <Syringe className="h-4 w-4" />
                      ⚠️ IV PUMP SETTINGS:
                    </div>
                    
                    {pumpSettings.medication_selection && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-blue-100/90 to-sky-200/80 rounded-2xl backdrop-blur-lg border border-blue-200/50 shadow-md shadow-blue-200/40">
                        <span className="font-bold text-blue-900 text-sm">PUMP MEDICATION:</span>
                        <div className="font-bold text-blue-900 break-words text-sm mt-2">{pumpSettings.medication_selection}</div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pumpSettings.cca_setting && (
                        <div className="bg-white/90 p-4 rounded-2xl backdrop-blur-lg border border-white/50 hover:bg-white transition-all duration-200 shadow-md shadow-blue-200/30">
                          <span className="font-semibold text-sm">CCA:</span> <span className="break-words text-sm font-medium">{pumpSettings.cca_setting}</span>
                        </div>
                      )}
                      {pumpSettings.line_option && (
                        <div className="bg-white/90 p-4 rounded-2xl backdrop-blur-lg border border-white/50 hover:bg-white transition-all duration-200 shadow-md shadow-blue-200/30">
                          <span className="font-semibold text-sm">Line:</span> <span className="break-words text-sm font-medium">{pumpSettings.line_option}</span>
                        </div>
                      )}
                      {pumpSettings.duration && (
                        <div className="bg-white/90 p-4 rounded-2xl backdrop-blur-lg border border-white/50 hover:bg-white transition-all duration-200 shadow-md shadow-blue-200/30">
                          <span className="font-semibold text-sm">Duration:</span> <span className="break-words text-sm font-medium">{pumpSettings.duration}</span>
                        </div>
                      )}
                      {pumpSettings.vtbi && (
                        <div className="bg-white/90 p-4 rounded-2xl backdrop-blur-lg border border-white/50 hover:bg-white transition-all duration-200 shadow-md shadow-blue-200/30">
                          <span className="font-semibold text-sm">VTBI:</span> <span className="break-words text-sm font-medium">{pumpSettings.vtbi}</span>
                        </div>
                      )}
                    </div>
                    {pumpSettings.pump_instructions && (
                      <div className="mt-4 pt-4 border-t border-blue-200/60">
                        <span className="font-semibold text-sm">Instructions:</span> <span className="break-words text-sm font-medium">{pumpSettings.pump_instructions}</span>
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
