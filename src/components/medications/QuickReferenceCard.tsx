
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
    <Card className="bg-white/98 backdrop-blur-xl border-2 border-white/80 rounded-3xl shadow-2xl shadow-violet-300/70 print:shadow-none print:border-2 print:border-black hover:shadow-2xl hover:shadow-violet-400/80 transition-all duration-300 ring-2 ring-violet-300/60 hover:ring-violet-400/70">
      <CardHeader className="p-6 sm:p-8 bg-white/98">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl font-bold flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              {medication.high_alert && (
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0 shadow-2xl drop-shadow-lg" />
              )}
              <span className="break-words leading-tight">{medication.medication_name}</span>
            </div>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="print:hidden flex-shrink-0 h-12 rounded-2xl bg-white/95 backdrop-blur-lg border-2 border-violet-300/70 hover:border-violet-400/80 hover:bg-gradient-to-r hover:from-violet-50/95 hover:to-purple-100/90 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-violet-300/50 min-h-[44px] whitespace-nowrap"
          >
            <Printer className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Print</span>
          </Button>
        </div>
        
        {medication.classification && medication.classification.length > 0 && (
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-5">
            {medication.classification.map((cls, index) => (
              <Badge key={index} variant="secondary" className="text-xs sm:text-sm bg-gradient-to-r from-violet-100/98 to-purple-200/95 text-violet-800 px-3 sm:px-4 py-2 rounded-2xl border-2 border-violet-300/70 backdrop-blur-lg hover:scale-105 hover:shadow-lg hover:from-violet-200/98 hover:to-purple-300/95 transition-all duration-200 font-semibold break-words max-w-full shadow-lg shadow-violet-200/60">
                <span className="truncate">{cls}</span>
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-6 sm:p-8 bg-white/98">
        <div className="space-y-6 sm:space-y-8">
          {dosing.map((dose) => {
            const pumpSettings = dose.infusion_pump_settings as any;
            
            return (
              <div key={dose.id} className="bg-gradient-to-br from-gray-50/98 to-white/95 rounded-3xl p-5 sm:p-6 backdrop-blur-lg border-2 border-gray-200/70 hover:shadow-xl transition-all duration-200 shadow-xl shadow-gray-300/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
                  <h4 className="text-base sm:text-lg font-bold break-words flex-1">{dose.patient_type}</h4>
                  <div className="flex flex-wrap gap-2 sm:gap-3 flex-shrink-0">
                    {dose.route && (
                      <Badge variant="outline" className="bg-white/95 border-2 border-gray-300/70 text-gray-800 text-xs sm:text-sm px-3 py-2 rounded-2xl backdrop-blur-lg hover:bg-white hover:scale-105 transition-all duration-200 font-semibold min-h-[32px] whitespace-nowrap shadow-lg shadow-gray-200/50">{dose.route}</Badge>
                    )}
                    {dose.requires_infusion_pump && (
                      <Badge variant="outline" className="flex items-center gap-2 text-blue-800 border-2 border-blue-300/70 bg-gradient-to-r from-blue-100/98 to-sky-200/95 text-xs sm:text-sm px-3 py-2 rounded-2xl backdrop-blur-lg hover:scale-105 transition-all duration-200 font-semibold min-h-[32px] whitespace-nowrap shadow-lg shadow-blue-200/60">
                        <Syringe className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">IV Pump</span>
                        <span className="sm:hidden">Pump</span>
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs sm:text-sm mb-4 break-words text-gray-700 leading-relaxed font-medium">{dose.indication}</p>
                <div className="p-4 bg-white/98 rounded-2xl border-2 border-white/70 mb-4 backdrop-blur-lg shadow-lg shadow-gray-200/50">
                  <p className="font-bold text-lg sm:text-xl break-words text-center">{dose.dose}</p>
                </div>
                {dose.concentration_supplied && (
                  <p className="text-xs sm:text-sm text-gray-700 break-words mb-4 bg-white/95 p-3 rounded-2xl font-medium border border-gray-200/60 shadow-md shadow-gray-200/40">
                    Concentration: {dose.concentration_supplied}
                  </p>
                )}
                {dose.requires_infusion_pump && pumpSettings && (
                  <div className="mt-5 p-5 sm:p-6 bg-gradient-to-br from-blue-50/98 to-sky-100/95 rounded-3xl text-xs sm:text-sm backdrop-blur-lg border-2 border-blue-200/70 hover:shadow-xl transition-all duration-200 shadow-xl shadow-blue-300/60">
                    <div className="font-bold text-blue-800 mb-4 flex items-center gap-3">
                      <Syringe className="h-4 w-4" />
                      ⚠️ IV PUMP SETTINGS:
                    </div>
                    
                    {pumpSettings.medication_selection && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-blue-100/98 to-sky-200/95 rounded-2xl backdrop-blur-lg border-2 border-blue-300/60 shadow-lg shadow-blue-200/50">
                        <span className="font-bold text-blue-900 text-xs sm:text-sm">PUMP MEDICATION:</span>
                        <div className="font-bold text-blue-900 break-words text-xs sm:text-sm mt-2">{pumpSettings.medication_selection}</div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {pumpSettings.cca_setting && (
                        <div className="bg-white/98 p-4 rounded-2xl backdrop-blur-lg border-2 border-white/60 hover:bg-white transition-all duration-200 shadow-lg shadow-blue-200/40">
                          <span className="font-semibold text-xs sm:text-sm">CCA:</span> <span className="break-words text-xs sm:text-sm font-medium">{pumpSettings.cca_setting}</span>
                        </div>
                      )}
                      {pumpSettings.line_option && (
                        <div className="bg-white/98 p-4 rounded-2xl backdrop-blur-lg border-2 border-white/60 hover:bg-white transition-all duration-200 shadow-lg shadow-blue-200/40">
                          <span className="font-semibold text-xs sm:text-sm">Line:</span> <span className="break-words text-xs sm:text-sm font-medium">{pumpSettings.line_option}</span>
                        </div>
                      )}
                      {pumpSettings.duration && (
                        <div className="bg-white/98 p-4 rounded-2xl backdrop-blur-lg border-2 border-white/60 hover:bg-white transition-all duration-200 shadow-lg shadow-blue-200/40">
                          <span className="font-semibold text-xs sm:text-sm">Duration:</span> <span className="break-words text-xs sm:text-sm font-medium">{pumpSettings.duration}</span>
                        </div>
                      )}
                      {pumpSettings.vtbi && (
                        <div className="bg-white/98 p-4 rounded-2xl backdrop-blur-lg border-2 border-white/60 hover:bg-white transition-all duration-200 shadow-lg shadow-blue-200/40">
                          <span className="font-semibold text-xs sm:text-sm">VTBI:</span> <span className="break-words text-xs sm:text-sm font-medium">{pumpSettings.vtbi}</span>
                        </div>
                      )}
                    </div>
                    {pumpSettings.pump_instructions && (
                      <div className="mt-4 pt-4 border-t-2 border-blue-300/70">
                        <span className="font-semibold text-xs sm:text-sm">Instructions:</span> <span className="break-words text-xs sm:text-sm font-medium">{pumpSettings.pump_instructions}</span>
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
