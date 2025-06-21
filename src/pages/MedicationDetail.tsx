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
import { DosingCalculator } from '@/components/medications/DosingCalculator';
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
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
    );
  }

  if (!medication) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500">Medication not found.</p>
            <Button onClick={() => navigate('/medications')} className="mt-4">
              Back to Medications
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/medications')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Medications
      </Button>

      {/* Emergency Header */}
      <div className={`mb-8 p-6 rounded-lg ${medication.high_alert ? 'bg-red-50 border-2 border-red-300' : 'bg-blue-50 border-2 border-blue-300'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Pill className="h-10 w-10 text-blue-600" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{medication.medication_name}</h1>
              {medication.classification && medication.classification.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {medication.classification.map((cls, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {cls}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            {medication.high_alert && (
              <Badge variant="destructive" className="flex items-center gap-2 text-lg p-2">
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

      {/* Quick Tools Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DosingCalculator medicationName={medication.medication_name} />
        <QuickReferenceCard medication={medication} dosing={dosing || []} />
      </div>

      {/* Contraindications - Always Visible if Present */}
      {contraindications && contraindications.length > 0 && (
        <Card className="mb-6 border-2 border-red-400 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 text-xl">
              <FileWarning className="h-6 w-6" />
              ⚠️ CONTRAINDICATIONS & PRECAUTIONS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contraindications.map((contraindication) => (
                <div key={contraindication.id} className="bg-white p-3 rounded-lg border border-red-200">
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
              <Button variant="outline" className="w-full flex items-center justify-between p-4 h-auto">
                <span className="flex items-center gap-2 text-lg font-semibold">
                  <Stethoscope className="h-5 w-5" />
                  Indications & Clinical Uses
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="p-4">
                  {indications.map((indication, index) => (
                    <div key={indication.id} className="mb-4 last:mb-0">
                      <Badge variant="outline" className="mb-2">
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
              <Button variant="outline" className="w-full flex items-center justify-between p-4 h-auto">
                <span className="text-lg font-semibold">
                  Administration & Preparation Details
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {administration.preparation && administration.preparation.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Preparation:</h4>
                        <ul className="space-y-1">
                          {administration.preparation.map((prep, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
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
  );
};

export default MedicationDetail;
