import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, AlertTriangle, Pill, Stethoscope, FileWarning } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/medications')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Medications
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Pill className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">{medication.medication_name}</h1>
          {medication.high_alert && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              High Alert Medication
            </Badge>
          )}
        </div>

        {medication.classification && medication.classification.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Classification:</p>
            <div className="flex flex-wrap gap-2">
              {medication.classification.map((cls, index) => (
                <Badge key={index} variant="secondary">
                  {cls}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Indications */}
        {indications && indications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Indications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {indications.map((indication, index) => (
                <div key={indication.id} className="mb-4 last:mb-0">
                  <Badge variant="outline" className="mb-2">
                    {indication.indication_type}
                  </Badge>
                  <p className="text-sm text-gray-700">{indication.indication_text}</p>
                  {index < indications.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Contraindications */}
        {contraindications && contraindications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <FileWarning className="h-5 w-5" />
                Contraindications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {contraindications.map((contraindication) => (
                  <li key={contraindication.id} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    {contraindication.contraindication}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Dosing Information */}
        {dosing && dosing.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Dosing Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dosing.map((dose) => (
                  <Card key={dose.id} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="default">{dose.patient_type}</Badge>
                        {dose.route && <Badge variant="outline">{dose.route}</Badge>}
                      </div>
                      <p className="text-sm font-medium">{dose.indication}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Dose:</p>
                          <p className="text-sm">{dose.dose}</p>
                        </div>
                        
                        {dose.concentration_supplied && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Concentration:</p>
                            <p className="text-sm">{dose.concentration_supplied}</p>
                          </div>
                        )}

                        {dose.notes && dose.notes.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Notes:</p>
                            <ul className="text-sm space-y-1">
                              {dose.notes.map((note, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  {note}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Administration Details */}
        {administration && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Administration Details</CardTitle>
            </CardHeader>
            <CardContent>
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
        )}
      </div>
    </div>
  );
};

export default MedicationDetail;
