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
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-blue-50/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(221,214,254,0.1),transparent_50%)]"></div>
        
        <div className="relative container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-6 bg-white/70 rounded-lg w-1/3"></div>
            <div className="h-4 bg-white/50 rounded-lg w-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-lg p-8">
                  <div className="h-6 bg-white/70 rounded-lg mb-5"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-white/50 rounded-lg"></div>
                    <div className="h-4 bg-white/50 rounded-lg w-3/4"></div>
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
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-blue-50/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.1),transparent_50%)]"></div>
        
        <div className="relative container mx-auto px-4 py-8 text-center">
          <Card className="bg-white/85 backdrop-blur-lg border border-white/30 rounded-lg py-12 shadow-lg">
            <CardContent className="p-8">
              <p className="text-gray-700 mb-6 text-lg font-medium">Medication not found.</p>
              <Button onClick={() => navigate('/medications')} className="rounded-lg bg-violet-500 hover:bg-violet-600 shadow-lg transition-all duration-300">
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
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-blue-50/40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(221,214,254,0.1),transparent_50%)]"></div>
      
      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/medications')}
          className="mb-8 flex items-center gap-3 bg-white/70 backdrop-blur-lg border border-white/30 hover:bg-white/80 rounded-lg transition-all duration-300 shadow-lg h-12 px-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Medications
        </Button>

        {/* Header */}
        <div className={`mb-10 p-6 rounded-lg bg-white/85 backdrop-blur-lg border border-white/30 shadow-lg transition-all duration-300 ${medication.high_alert ? 'ring-1 ring-red-400/60' : 'ring-1 ring-violet-200/40'}`}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-violet-100 to-purple-200 rounded-lg border border-violet-200/50 shadow-lg">
                  <Pill className="h-6 w-6 text-violet-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 break-words leading-tight">{medication.medication_name}</h1>
                  {medication.classification && medication.classification.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {medication.classification.map((cls, index) => (
                        <Badge key={index} variant="secondary" className="text-sm bg-gradient-to-r from-violet-100 to-purple-200 text-violet-800 px-3 py-1 rounded-lg border border-violet-200/60 font-medium">
                          <span className="break-words max-w-32">{cls}</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                {medication.high_alert && (
                  <Badge variant="destructive" className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-red-500 to-red-600 border border-red-300/50 font-bold">
                    <AlertTriangle className="h-4 w-4" />
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
            <h2 className="text-lg font-bold mb-6 text-center uppercase tracking-wide text-gray-800">Emergency Dosing</h2>
            <PatientTypeTabs dosing={dosing} isHighAlert={medication.high_alert} />
          </div>
        )}

        {/* Quick Reference Section */}
        <div className="mb-10">
          <QuickReferenceCard medication={medication} dosing={dosing || []} />
        </div>

        {/* Contraindications */}
        {contraindications && contraindications.length > 0 && (
          <Card className="mb-8 bg-gradient-to-br from-red-50 to-rose-100 border border-red-200/50 rounded-lg shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-4 text-red-800 text-lg font-bold">
                <div className="p-3 bg-red-100 rounded-lg border border-red-200/60 shadow-lg">
                  <FileWarning className="h-5 w-5" />
                </div>
                ⚠️ Contraindications & Precautions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {contraindications.map((contraindication) => (
                  <div key={contraindication.id} className="bg-white p-4 rounded-lg border border-red-100/70 hover:bg-white/95 hover:shadow-md transition-all duration-200 shadow-lg">
                    <p className="text-sm text-red-800 font-medium break-words leading-relaxed">
                      • {contraindication.contraindication}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Collapsible Sections */}
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
      </div>
    </div>
  );
};

export default MedicationDetail;
