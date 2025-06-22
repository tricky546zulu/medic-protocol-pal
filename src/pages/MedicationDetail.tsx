
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent>
              <p className="text-gray-500">Medication not found.</p>
              <Button onClick={() => navigate('/medications')} className="mt-4 rounded-xl">
                Back to Medications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/medications')}
          className="mb-6 flex items-center gap-2 hover:bg-white/50 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Medications
        </Button>

        {/* Emergency Header */}
        <div className={`mb-8 p-6 rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border-0 ${medication.high_alert ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-primary'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
                <Pill className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{medication.medication_name}</h1>
                {medication.classification && medication.classification.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {medication.classification.map((cls, index) => (
                      <Badge key={index} variant="secondary" className="text-sm bg-gray-100 text-gray-700">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              {medication.high_alert && (
                <Badge variant="destructive" className="flex items-center gap-2 text-lg p-2 rounded-xl">
                  <AlertTriangle className="h-5 w-5" />
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
            <h2 className="text-2xl font-bold mb-6 text-center">EMERGENCY DOSING</h2>
            <PatientTypeTabs dosing={dosing} isHighAlert={medication.high_alert} />
          </div>
        )}

        {/* Quick Reference Section */}
        <div className="mb-8">
          <QuickReferenceCard medication={medication} dosing={dosing || []} />
        </div>

        {/* Contraindications - Always Visible if Present */}
        {contraindications && contraindications.length > 0 && (
          <Card className="mb-6 border-0 shadow-xl bg-red-50/80 backdrop-blur-sm border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 text-xl">
                <FileWarning className="h-6 w-6" />
                ⚠️ CONTRAINDICATIONS & PRECAUTIONS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contraindications.map((contraindication) => (
                  <div key={contraindication.id} className="bg-white/80 p-3 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800 font-medium">
                      • {contraindication.contraindication}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Collapsible Detailed Information */}
        <div className="space-y-4">
          {/* Indications */}
          {indications && indications.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-between p-4 h-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                  <span className="flex items-center gap-2 text-lg font-semibold">
                    <Stethoscope className="h-5 w-5" />
                    Indications & Clinical Uses
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="mt-2 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    {indications.map((indication, index) => (
                      <div key={indication.id} className="mb-4 last:mb-0">
                        <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20">
                          {indication.indication_type}
                        </Badge>
                        <p className="text-sm text-gray-700">{indication.indication_text}</p>
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
                <Button variant="outline" className="w-full flex items-center justify-between p-4 h-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                  <span className="text-lg font-semibold">
                    Administration & Preparation Details
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="mt-2 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {administration.preparation && administration.preparation.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Preparation:</h4>
                          <ul className="space-y-1">
                            {administration.preparation.map((prep, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                {prep}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {administration.administration_notes && administration.administration_notes.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Administration:</h4>
                          <ul className="space-y-1">
                            {administration.administration_notes.map((note, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {administration.monitoring && administration.monitoring.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Monitoring:</h4>
                          <ul className="space-y-1">
                            {administration.monitoring.map((monitor, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                {monitor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {administration.adverse_effects && administration.adverse_effects.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Adverse Effects:</h4>
                          <ul className="space-y-1">
                            {administration.adverse_effects.map((effect, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                {effect}
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
