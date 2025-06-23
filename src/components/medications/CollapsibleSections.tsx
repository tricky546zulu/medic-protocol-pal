
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Stethoscope, Pill, ChevronDown } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Indication = Database['public']['Tables']['medication_indications']['Row'];
type Administration = Database['public']['Tables']['medication_administration']['Row'];

interface CollapsibleSectionsProps {
  indications?: Indication[];
  administration?: Administration;
}

export const CollapsibleSections = ({ indications, administration }: CollapsibleSectionsProps) => {
  return (
    <div className="space-y-4">
      {/* Indications */}
      {indications && indications.length > 0 && (
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full p-2 sm:p-4 h-auto bg-white/85 backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-lg hover:bg-white/90 transition-all duration-300 rounded-lg">
              <div className="flex flex-col items-center justify-center w-full gap-2 sm:gap-3 relative">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1 sm:p-2 bg-gradient-to-br from-sky-100 to-blue-200 rounded-lg border border-sky-200/60 shadow-lg flex-shrink-0">
                    <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4 text-sky-700" />
                  </div>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-gray-800 text-center break-words leading-tight max-w-none">
                    Indications & Clinical Uses
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 transition-transform duration-200 absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-4 bg-white/85 backdrop-blur-lg border border-white/30 rounded-lg shadow-lg">
              <CardContent className="p-6">
                {indications.map((indication, index) => (
                  <div key={indication.id} className="mb-6 last:mb-0">
                    <Badge variant="outline" className="mb-3 bg-gradient-to-r from-sky-100 to-blue-200 text-sky-800 border-sky-200/60 text-sm px-3 py-1 rounded-lg font-medium shadow-lg">
                      <span className="break-words max-w-48">{indication.indication_type}</span>
                    </Badge>
                    <p className="text-sm text-gray-800 break-words leading-relaxed font-medium">{indication.indication_text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Administration Details */}
      {administration && (
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full p-2 sm:p-4 h-auto bg-white/85 backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-lg hover:bg-white/90 transition-all duration-300 rounded-lg">
              <div className="flex flex-col items-center justify-center w-full gap-2 sm:gap-3 relative">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1 sm:p-2 bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg border border-emerald-200/60 shadow-lg flex-shrink-0">
                    <Pill className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-700" />
                  </div>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-gray-800 text-center break-words leading-tight max-w-none">
                    Administration & Preparation Details
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 transition-transform duration-200 absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-4 bg-white/85 backdrop-blur-lg border border-white/30 rounded-lg shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {administration.preparation && administration.preparation.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 text-base uppercase tracking-wide">Preparation:</h4>
                      <ul className="space-y-3">
                        {administration.preparation.map((prep, index) => (
                          <li key={index} className="text-sm text-gray-800 flex items-start gap-3 bg-gradient-to-r from-emerald-50 to-green-100 p-3 rounded-lg hover:shadow-md transition-all duration-200 shadow-md">
                            <span className="text-emerald-600 mt-1 flex-shrink-0 font-bold">•</span>
                            <span className="break-words leading-relaxed font-medium">{prep}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {administration.administration_notes && administration.administration_notes.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 text-base uppercase tracking-wide">Administration:</h4>
                      <ul className="space-y-3">
                        {administration.administration_notes.map((note, index) => (
                          <li key={index} className="text-sm text-gray-800 flex items-start gap-3 bg-gradient-to-r from-blue-50 to-sky-100 p-3 rounded-lg hover:shadow-md transition-all duration-200 shadow-md">
                            <span className="text-blue-600 mt-1 flex-shrink-0 font-bold">•</span>
                            <span className="break-words leading-relaxed font-medium">{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {administration.monitoring && administration.monitoring.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 text-base uppercase tracking-wide">Monitoring:</h4>
                      <ul className="space-y-3">
                        {administration.monitoring.map((monitor, index) => (
                          <li key={index} className="text-sm text-gray-800 flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-100 p-3 rounded-lg hover:shadow-md transition-all duration-200 shadow-md">
                            <span className="text-green-600 mt-1 flex-shrink-0 font-bold">•</span>
                            <span className="break-words leading-relaxed font-medium">{monitor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {administration.adverse_effects && administration.adverse_effects.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 text-base uppercase tracking-wide">Adverse Effects:</h4>
                      <ul className="space-y-3">
                        {administration.adverse_effects.map((effect, index) => (
                          <li key={index} className="text-sm text-gray-800 flex items-start gap-3 bg-gradient-to-r from-red-50 to-rose-100 p-3 rounded-lg hover:shadow-md transition-all duration-200 shadow-md">
                            <span className="text-red-600 mt-1 flex-shrink-0 font-bold">•</span>
                            <span className="break-words leading-relaxed font-medium">{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
