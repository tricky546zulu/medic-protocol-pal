
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-white/60 rounded-xl w-1/3"></div>
            <div className="h-3 bg-white/40 rounded-xl w-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="h-4 bg-white/60 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-white/40 rounded-xl"></div>
                    <div className="h-3 bg-white/40 rounded-xl w-3/4"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
        <div className="container mx-auto px-4 py-8 text-center">
          <Card className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl py-8">
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4 text-sm">Medication not found.</p>
              <Button onClick={() => navigate('/medications')} className="rounded-xl">
                Back to Medications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/medications')}
          className="mb-6 flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/20 hover:bg-white/80 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Medications
        </Button>

        {/* Enhanced Header with Glass Morphism */}
        <div className={`mb-8 p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white/20 shadow-xl ${medication.high_alert ? 'ring-2 ring-red-200/50' : 'ring-1 ring-blue-200/30'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="flex-shrink-0 p-3 bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-200/30">
                <Pill className="h-6 w-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 break-words leading-tight">{medication.medication_name}</h1>
                {medication.classification && medication.classification.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {medication.classification.map((cls, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-white/70 text-gray-700 px-3 py-1 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 flex-shrink-0">
              {medication.high_alert && (
                <Badge variant="destructive" className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl shadow-lg bg-red-500/90 backdrop-blur-sm hover:bg-red-600/90 border border-red-300/30">
                  <AlertTriangle className="h-4 w-4" />
                  HIGH ALERT MEDICATION
                </Badge>
              )}
              <BookmarkButton 
                medicationId={medication.id} 
                medicationName={medication.medication_name} 
              />
            </div>
          </div>
        </div>

        {/* Emergency Dosing Section */}
        {dosing && dosing.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold mb-6 text-center uppercase tracking-wide text-gray-700">Emergency Dosing</h2>
            <PatientTypeTabs dosing={dosing} isHighAlert={medication.high_alert} />
          </div>
        )}

        {/* Quick Reference Section */}
        <div className="mb-8">
          <QuickReferenceCard medication={medication} dosing={dosing || []} />
        </div>

        {/* Contraindications - Enhanced Translucent Style */}
        {contraindications && contraindications.length > 0 && (
          <Card className="mb-6 bg-red-50/80 backdrop-blur-md border border-red-200/30 rounded-2xl shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-3 text-red-700 text-base font-semibold">
                <div className="p-2 bg-red-100/70 rounded-xl">
                  <FileWarning className="h-5 w-5" />
                </div>
                ⚠️ Contraindications & Precautions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contraindications.map((contraindication) => (
                  <div key={contraindication.id} className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-red-100/50">
                    <p className="text-sm text-red-800 font-medium break-words leading-relaxed">
                      • {contraindication.contraindication}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Collapsible Sections */}
        <div className="space-y-4">
          {/* Indications */}
          {indications && indications.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-between p-6 h-auto bg-white/80 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-200 rounded-2xl">
                  <span className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                    <div className="p-2 bg-blue-100/70 rounded-xl">
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                    </div>
                    Indications & Clinical Uses
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="mt-3 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg">
                  <CardContent className="p-6">
                    {indications.map((indication, index) => (
                      <div key={indication.id} className="mb-4 last:mb-0">
                        <Badge variant="outline" className="mb-3 bg-blue-50/70 text-blue-700 border-blue-200/50 text-xs px-3 py-1 rounded-xl backdrop-blur-sm">
                          {indication.indication_type}
                        </Badge>
                        <p className="text-sm text-gray-700 break-words leading-relaxed">{indication.indication_text}</p>
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
                <Button variant="outline" className="w-full flex items-center justify-between p-6 h-auto bg-white/80 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-200 rounded-2xl">
                  <span className="text-sm font-semibold text-gray-700">
                    Administration & Preparation Details
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="mt-3 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {administration.preparation && administration.preparation.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Preparation:</h4>
                          <ul className="space-y-2">
                            {administration.preparation.map((prep, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-3 bg-gray-50/70 p-3 rounded-xl backdrop-blur-sm">
                                <span className="text-blue-500 mt-0.5 flex-shrink-0 font-semibold">•</span>
                                <span className="break-words leading-relaxed">{prep}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {administration.administration_notes && administration.administration_notes.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Administration:</h4>
                          <ul className="space-y-2">
                            {administration.administration_notes.map((note, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-3 bg-blue-50/70 p-3 rounded-xl backdrop-blur-sm">
                                <span className="text-blue-600 mt-0.5 flex-shrink-0 font-semibold">•</span>
                                <span className="break-words leading-relaxed">{note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {administration.monitoring && administration.monitoring.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Monitoring:</h4>
                          <ul className="space-y-2">
                            {administration.monitoring.map((monitor, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-3 bg-green-50/70 p-3 rounded-xl backdrop-blur-sm">
                                <span className="text-green-600 mt-0.5 flex-shrink-0 font-semibold">•</span>
                                <span className="break-words leading-relaxed">{monitor}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {administration.adverse_effects && administration.adverse_effects.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Adverse Effects:</h4>
                          <ul className="space-y-2">
                            {administration.adverse_effects.map((effect, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-3 bg-red-50/70 p-3 rounded-xl backdrop-blur-sm">
                                <span className="text-red-600 mt-0.5 flex-shrink-0 font-semibold">•</span>
                                <span className="break-words leading-relaxed">{effect}</span>
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
