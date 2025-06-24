
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Syringe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { WizardStepProps } from './types';

export const ReviewStep = ({ data }: WizardStepProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('Submitting medication data:', data);
      
      // Insert basic medication info
      const { data: medicationData, error: medicationError } = await supabase
        .from('medications')
        .insert({
          medication_name: data.basic.medication_name,
          classification: data.basic.classification,
          high_alert: data.basic.high_alert,
          infusion_only: data.basic.infusion_only || false,
        })
        .select()
        .single();

      if (medicationError) throw medicationError;

      const medicationId = medicationData.id;

      // Insert related data
      const insertPromises = [];

      if (data.indications.length > 0) {
        insertPromises.push(
          supabase.from('medication_indications').insert(
            data.indications.map(ind => ({ ...ind, medication_id: medicationId }))
          )
        );
      }

      if (data.contraindications.length > 0) {
        insertPromises.push(
          supabase.from('medication_contraindications').insert(
            data.contraindications.map(contra => ({ contraindication: contra, medication_id: medicationId }))
          )
        );
      }

      if (data.dosing.length > 0) {
        console.log('Inserting dosing data:', data.dosing);
        insertPromises.push(
          supabase.from('medication_dosing').insert(
            data.dosing.map(dose => {
              console.log('Inserting dose with pump settings:', dose.infusion_pump_settings);
              return { 
                ...dose, 
                medication_id: medicationId,
                infusion_pump_settings: dose.infusion_pump_settings as any
              };
            })
          )
        );
      }

      // Always insert administration data, even if empty
      insertPromises.push(
        supabase.from('medication_administration').insert({
          ...data.administration,
          medication_id: medicationId,
        })
      );

      await Promise.all(insertPromises);

      toast({
        title: "Success!",
        description: `${data.basic.infusion_only ? 'Infusion protocol' : 'Medication'} "${data.basic.medication_name}" has been created successfully.`,
      });

      // Reset form or redirect
      window.location.reload();
    } catch (error: any) {
      console.error('Error creating medication:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create medication",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Review Your {data.basic.infusion_only ? 'Infusion Protocol' : 'Medication'}</h2>
        <p className="text-gray-600">
          Please review all the information below before submitting.
        </p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Basic Information
            {data.basic.infusion_only && <Syringe className="h-5 w-5 text-blue-600" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Name:</span> {data.basic.medication_name}
            </div>
            {data.basic.classification.length > 0 && (
              <div>
                <span className="font-medium">Classification:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.basic.classification.map((cls, index) => (
                    <Badge key={index} variant="secondary">{cls}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-4">
              {data.basic.high_alert && (
                <Badge variant="outline" className="flex items-center gap-1 text-red-700 border-red-300">
                  <AlertTriangle className="h-3 w-3" />
                  High Alert
                </Badge>
              )}
              {data.basic.infusion_only && (
                <Badge variant="outline" className="flex items-center gap-1 text-blue-700 border-blue-300">
                  <Syringe className="h-3 w-3" />
                  Infusion Only
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indications - Only show for non-infusion-only */}
      {!data.basic.infusion_only && data.indications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Indications ({data.indications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.indications.map((indication, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline">{indication.indication_type}</Badge>
                  <span>{indication.indication_text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contraindications - Only show for non-infusion-only */}
      {!data.basic.infusion_only && data.contraindications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Contraindications ({data.contraindications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {data.contraindications.map((contra, index) => (
                <li key={index}>{contra}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Dosing/Infusion Protocols */}
      {data.dosing.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {data.basic.infusion_only ? 'Infusion Protocols' : 'Dosing Protocols'} ({data.dosing.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.dosing.map((dose, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{dose.patient_type}</Badge>
                    {dose.route && <Badge variant="secondary">{dose.route}</Badge>}
                    {(dose.requires_infusion_pump || data.basic.infusion_only) && (
                      <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 border-blue-300">
                        <Syringe className="h-3 w-3" />
                        {data.basic.infusion_only ? 'Infusion Protocol' : 'IV Pump'}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div><span className="font-medium">Indication:</span> {dose.indication}</div>
                    {!data.basic.infusion_only && (
                      <div><span className="font-medium">Dose:</span> {dose.dose}</div>
                    )}
                    {dose.concentration_supplied && (
                      <div><span className="font-medium">Concentration:</span> {dose.concentration_supplied}</div>
                    )}
                    {(dose.requires_infusion_pump || data.basic.infusion_only) && dose.infusion_pump_settings?.medication_selection && (
                      <div className="text-sm text-blue-800 bg-blue-50 p-2 rounded mt-2">
                        <div className="font-medium">Medication: {dose.infusion_pump_settings.medication_selection}</div>
                        {dose.infusion_pump_settings.cca_setting && (
                          <div>CCA: {dose.infusion_pump_settings.cca_setting}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Administration - Only show for non-infusion-only */}
      {!data.basic.infusion_only && (
        data.administration.preparation?.length > 0 || 
        data.administration.administration_notes?.length > 0 || 
        data.administration.monitoring?.length > 0 || 
        data.administration.adverse_effects?.length > 0
      ) && (
        <Card>
          <CardHeader>
            <CardTitle>Administration Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.administration.preparation && data.administration.preparation.length > 0 && (
                <div>
                  <span className="font-medium">Preparation:</span>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {data.administration.preparation.map((prep, index) => (
                      <li key={index}>{prep}</li>
                    ))}
                  </ul>
                </div>
              )}
              {data.administration.monitoring && data.administration.monitoring.length > 0 && (
                <div>
                  <span className="font-medium">Monitoring:</span>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {data.administration.monitoring.map((monitor, index) => (
                      <li key={index}>{monitor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center pt-6">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="px-8"
        >
          {isSubmitting ? 'Creating...' : `Create ${data.basic.infusion_only ? 'Infusion Protocol' : 'Medication'}`}
        </Button>
      </div>
    </div>
  );
};
