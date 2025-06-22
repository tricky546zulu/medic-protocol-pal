
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, AlertTriangle, Pill, Stethoscope, FileWarning, ChevronDown } from 'lucide-react';
import { PatientTypeTabs } from '@/components/medications/PatientTypeTabs';
import { BookmarkButton } from '@/components/medications/BookmarkButton';
import { QuickReferenceCard } from '@/components/medications/QuickReferenceCard';
import { toast } from '@/hooks/use-toast';

const MedicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: medication, isLoading: medicationLoading } = useQuery({
    queryKey: ['medication', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: indications } = useQuery({
    queryKey: ['medication-indications', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medication_indications')
        .select('*')
        .eq('medication_id', id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: contraindications } = useQuery({
    queryKey: ['medication-contraindications', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medication_contraindications')
        .select('*')
        .eq('medication_id', id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: dosing } = useQuery({
    queryKey: ['medication-dosing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medication_dosing')
        .select('*')
        .eq('medication_id', id)
        .order('patient_type');
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: administration } = useQuery({
    queryKey: ['medication-administration', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medication_administration')
        .select('*')
        .eq('medication_id', id);
      
      if (error) throw error;
      return data?.[0];
    },
    enabled: !!id,
  });

  if (medicationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-violet-50 to-sky-100 relative overflow-hidden">
        {/* Enhanced background texture */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-blue-50/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(221,214,254,0.1),transparent_50%)]"></div>
        
        <div className="relative container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-6 bg-white/70 rounded-2xl w-1/3"></div>
            <div className="h-4 bg-white/50 rounded-2xl w-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-3xl p-8">
                  <div className="h-6 bg-white/70 rounded-2xl mb-5"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-white/50 rounded-2xl"></div>
                    <div className="h-4 bg-white/50 rounded-2xl w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-violet-50 to-sky-100 relative overflow-hidden">
        {/* Enhanced background texture */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-blue-50/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.1),transparent_50%)]"></div>
        
        <div className="relative container mx-auto px-4 py-8 text-center">
          <Card className="bg-white/85 backdrop-blur-lg border border-white/30 rounded-3xl py-12 shadow-2xl shadow-violet-200/60 ring-1 ring-violet-200/30">
            <CardContent className="p-8">
              <p className="text-gray-700 mb-6 text-lg font-medium">Medication not found.</p>
              <Button onClick={() => navigate('/medications')} className="rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-300/50 hover:shadow-xl hover:shadow-violet-400/60 transition-all duration-300 hover:scale-105">
                Back to Medications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-violet-50 to-sky-100 relative overflow-hidden">
      {/* Enhanced background texture */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-blue-50/40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(221,214,254,0.1),transparent_50%)]"></div>
      
      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/medications')}
          className="mb-8 flex items-center gap-3 bg-white/70 backdrop-blur-lg border border-white/30 hover:bg-white/80 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-violet-200/40 hover:shadow-xl hover:shadow-violet-300/50 h-12 px-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Medications
        </Button>

        {/* Enhanced Header with Pastel Glass Morphism */}
        <div className={`mb-10 p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-lg border border-white/30 shadow-2xl transition-all duration-300 hover:shadow-2xl ring-1 ${medication.high_alert ? 'ring-red-400/60 shadow-red-300/50' : 'ring-violet-200/40 shadow-violet-200/60'}`}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
                <div className="flex-shrink-0 p-3 sm:p-4 bg-gradient-to-br from-violet-100/90 to-purple-200/80 backdrop-blur-lg rounded-2xl border border-violet-200/50 hover:scale-105 transition-transform duration-300 shadow-lg shadow-violet-200/50">
                  <Pill className="h-6 w-6 sm:h-7 sm:w-7 text-violet-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 break-words leading-tight">{medication.medication_name}</h1>
                  {medication.classification && medication.classification.length > 0 && (
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {medication.classification.map((cls, index) => (
                        <Badge key={index} variant="secondary" className="text-xs sm:text-sm bg-gradient-to-r from-violet-100/90 to-purple-200/80 text-violet-800 px-3 sm:px-4 py-2 rounded-2xl border border-violet-200/60 backdrop-blur-lg hover:scale-105 hover:shadow-md hover:from-violet-200/90 hover:to-purple-300/80 transition-all duration-200 font-semibold break-words max-w-full">
                          <span className="truncate">{cls}</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-shrink-0">
                {medication.high_alert && (
                  <Badge variant="destructive" className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg px-4 sm:px-6 py-3 rounded-2xl shadow-2xl bg-gradient-to-r from-red-500 to-red-600 backdrop-blur-lg hover:from-red-600 hover:to-red-700 border border-red-300/50 ring-2 ring-red-400/40 font-bold min-h-[44px] whitespace-nowrap">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">HIGH ALERT MEDICATION</span>
                    <span className="sm:hidden">HIGH ALERT</span>
                  </Badge>
                )}
                <BookmarkButton 
                  medicationId={medication.id} 
                  medicationName={medication.medication_name} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Dosing Section */}
        {dosing && dosing.length > 0 && (
          <div className="mb-10">
            <h2 className="text-base sm:text-lg font-bold mb-8 text-center uppercase tracking-wide text-gray-800">Emergency Dosing</h2>
            <PatientTypeTabs dosing={dosing} isHighAlert={medication.high_alert} />
          </div>
        )}

        {/* Quick Reference Section */}
        <div className="mb-10">
          <QuickReferenceCard medication={medication} dosing={dosing || []} />
        </div>

        {/* Enhanced Contraindications */}
        {contraindications && contraindications.length > 0 && (
          <Card className="mb-8 bg-gradient-to-br from-red-50/90 to-rose-100/80 backdrop-blur-lg border border-red-200/50 rounded-3xl shadow-2xl hover:shadow-2xl transition-all duration-300 ring-1 ring-red-200/40">
            <CardHeader className="p-6 sm:p-8">
              <CardTitle className="flex items-center gap-4 text-red-800 text-base sm:text-lg font-bold">
                <div className="p-3 bg-red-100/90 rounded-2xl backdrop-blur-lg border border-red-200/60 shadow-lg shadow-red-200/50">
                  <FileWarning className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                ⚠️ Contraindications & Precautions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {contraindications.map((contraindication) => (
                  <div key={contraindication.id} className="bg-white/90 backdrop-blur-lg p-4 sm:p-5 rounded-2xl border border-red-100/70 hover:bg-white/95 hover:shadow-md transition-all duration-200 shadow-lg shadow-red-200/40">
                    <p className="text-sm sm:text-base text-red-800 font-semibold break-words leading-relaxed">
                      • {contraindication.contraindication}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Collapsible Sections */}
        <div className="space-y-5">
          {/* Indications */}
          {indications && indications.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-between p-6 sm:p-8 h-auto bg-white/85 backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-2xl hover:bg-white/90 transition-all duration-300 rounded-3xl hover:scale-[1.01] ring-1 ring-violet-200/30 hover:ring-violet-300/50">
                  <span className="flex items-center gap-4 text-base sm:text-lg font-bold text-gray-800 min-w-0 flex-1">
                    <div className="p-3 bg-gradient-to-br from-sky-100/90 to-blue-200/80 rounded-2xl backdrop-blur-lg border border-sky-200/60 shadow-lg shadow-sky-200/50 flex-shrink-0">
                      <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-sky-700" />
                    </div>
                    <span className="break-words">Indications & Clinical Uses</span>
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-600 transition-transform duration-200 flex-shrink-0" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="mt-4 bg-white/85 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl ring-1 ring-sky-200/30">
                  <CardContent className="p-6 sm:p-8">
                    {indications.map((indication, index) => (
                      <div key={indication.id} className="mb-6 last:mb-0">
                        <Badge variant="outline" className="mb-4 bg-gradient-to-r from-sky-100/90 to-blue-200/80 text-sky-800 border-sky-200/60 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-2xl backdrop-blur-lg hover:scale-105 transition-all duration-200 font-semibold shadow-lg shadow-sky-200/40 max-w-full">
                          <span className="truncate">{indication.indication_type}</span>
                        </Badge>
                        <p className="text-sm sm:text-base text-gray-800 break-words leading-relaxed font-medium">{indication.indication_text}</p>
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
                <Button variant="outline" className="w-full flex items-center justify-between p-6 sm:p-8 h-auto bg-white/85 backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-2xl hover:bg-white/90 transition-all duration-300 rounded-3xl hover:scale-[1.01] ring-1 ring-violet-200/30 hover:ring-violet-300/50">
                  <span className="text-base sm:text-lg font-bold text-gray-800 break-words min-w-0 flex-1 text-left">
                    Administration & Preparation Details
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-600 transition-transform duration-200 flex-shrink-0" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="mt-4 bg-white/85 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl ring-1 ring-emerald-200/30">
                  <CardContent className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                      {administration.preparation && administration.preparation.length > 0 && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4 text-base sm:text-lg uppercase tracking-wide">Preparation:</h4>
                          <ul className="space-y-3">
                            {administration.preparation.map((prep, index) => (
                              <li key={index} className="text-sm sm:text-base text-gray-800 flex items-start gap-3 sm:gap-4 bg-gradient-to-r from-emerald-50/90 to-green-100/80 p-4 rounded-2xl backdrop-blur-lg hover:shadow-md transition-all duration-200 shadow-md shadow-emerald-200/40">
                                <span className="text-emerald-600 mt-1 flex-shrink-0 font-bold text-base sm:text-lg">•</span>
                                <span className="break-words leading-relaxed font-medium">{prep}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {administration.administration_notes && administration.administration_notes.length > 0 && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4 text-base sm:text-lg uppercase tracking-wide">Administration:</h4>
                          <ul className="space-y-3">
                            {administration.administration_notes.map((note, index) => (
                              <li key={index} className="text-sm sm:text-base text-gray-800 flex items-start gap-3 sm:gap-4 bg-gradient-to-r from-blue-50/90 to-sky-100/80 p-4 rounded-2xl backdrop-blur-lg hover:shadow-md transition-all duration-200 shadow-md shadow-blue-200/40">
                                <span className="text-blue-600 mt-1 flex-shrink-0 font-bold text-base sm:text-lg">•</span>
                                <span className="break-words leading-relaxed font-medium">{note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {administration.monitoring && administration.monitoring.length > 0 && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4 text-base sm:text-lg uppercase tracking-wide">Monitoring:</h4>
                          <ul className="space-y-3">
                            {administration.monitoring.map((monitor, index) => (
                              <li key={index} className="text-sm sm:text-base text-gray-800 flex items-start gap-3 sm:gap-4 bg-gradient-to-r from-green-50/90 to-emerald-100/80 p-4 rounded-2xl backdrop-blur-lg hover:shadow-md transition-all duration-200 shadow-md shadow-green-200/40">
                                <span className="text-green-600 mt-1 flex-shrink-0 font-bold text-base sm:text-lg">•</span>
                                <span className="break-words leading-relaxed font-medium">{monitor}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {administration.adverse_effects && administration.adverse_effects.length > 0 && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4 text-base sm:text-lg uppercase tracking-wide">Adverse Effects:</h4>
                          <ul className="space-y-3">
                            {administration.adverse_effects.map((effect, index) => (
                              <li key={index} className="text-sm sm:text-base text-gray-800 flex items-start gap-3 sm:gap-4 bg-gradient-to-r from-red-50/90 to-rose-100/80 p-4 rounded-2xl backdrop-blur-lg hover:shadow-md transition-all duration-200 shadow-md shadow-red-200/40">
                                <span className="text-red-600 mt-1 flex-shrink-0 font-bold text-base sm:text-lg">•</span>
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
      </div>
    </div>
  );
};

export default MedicationDetail;
