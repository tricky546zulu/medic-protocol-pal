
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { WizardStepProps } from './types';

export const ReviewStep = ({ data }: WizardStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Insert main medication record
      const { data: medication, error: medicationError } = await supabase
        .from('medications')
        .insert({
          medication_name: data.basic.medication_name,
          classification: data.basic.classification.length > 0 ? data.basic.classification : null,
          high_alert: data.basic.high_alert,
        })
        .select()
        .single();

      if (medicationError) throw medicationError;

      const medicationId = medication.id;

      // Insert indications
      if (data.indications.length > 0) {
        const { error: indicationsError } = await supabase
          .from('medication_indications')
          .insert(
            data.indications.map(indication => ({
              medication_id: medicationId,
              indication_type: indication.indication_type,
              indication_text: indication.indication_text,
            }))
          );

        if (indicationsError) throw indicationsError;
      }

      // Insert contraindications
      if (data.contraindications.length > 0) {
        const { error: contraindicationsError } = await supabase
          .from('medication_contraindications')
          .insert(
            data.contraindications.map(contraindication => ({
              medication_id: medicationId,
              contraindication: contraindication,
            }))
          );

        if (contraindicationsError) throw contraindicationsError;
      }

      // Insert dosing information
      if (data.dosing.length > 0) {
        const { error: dosingError } = await supabase
          .from('medication_dosing')
          .insert(
            data.dosing.map(dosing => ({
              medication_id: medicationId,
              patient_type: dosing.patient_type,
              indication: dosing.indication,
              dose: dosing.dose,
              route: dosing.route || null,
              provider_routes: dosing.provider_routes?.length ? dosing.provider_routes : null,
              concentration_supplied: dosing.concentration_supplied || null,
              compatibility_stability: dosing.compatibility_stability?.length ? dosing.compatibility_stability : null,
              notes: dosing.notes?.length ? dosing.notes : null,
            }))
          );

        if (dosingError) throw dosingError;
      }

      // Insert administration information
      const hasAdminData = Object.values(data.administration).some(arr => arr.length > 0);
      if (hasAdminData) {
        const { error: administrationError } = await supabase
          .from('medication_administration')
          .insert({
            medication_id: medicationId,
            preparation: data.administration.preparation.length > 0 ? data.administration.preparation : null,
            administration_notes: data.administration.administration_notes.length > 0 ? data.administration.administration_notes : null,
            monitoring: data.administration.monitoring.length > 0 ? data.administration.monitoring : null,
            adverse_effects: data.administration.adverse_effects.length > 0 ? data.administration.adverse_effects : null,
          });

        if (administrationError) throw administrationError;
      }

      toast({
        title: "Success!",
        description: `${data.basic.medication_name} has been added successfully with all related information.`,
      });

      // Reset form or redirect
      window.location.reload();

    } catch (error: any) {
      console.error('Error submitting medication:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add medication",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        Review all the information below before submitting. You can go back to any step to make changes.
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Basic Information
            {data.basic.high_alert && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                High Alert
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div><strong>Name:</strong> {data.basic.medication_name}</div>
            {data.basic.classification.length > 0 && (
              <div>
                <strong>Classifications:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.basic.classification.map((cls, index) => (
                    <Badge key={index} variant="secondary">{cls}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Indications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Indications
            {data.indications.length > 0 ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.indications.length > 0 ? (
            <div className="space-y-2">
              {data.indications.map((indication, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <Badge variant="outline" className="mb-1">{indication.indication_type}</Badge>
                  <p className="text-sm">{indication.indication_text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No indications added</p>
          )}
        </CardContent>
      </Card>

      {/* Contraindications */}
      <Card>
        <CardHeader>
          <CardTitle>Contraindications</CardTitle>
        </CardHeader>
        <CardContent>
          {data.contraindications.length > 0 ? (
            <ul className="space-y-1">
              {data.contraindications.map((contraindication, index) => (
                <li key={index} className="text-sm">• {contraindication}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No contraindications added</p>
          )}
        </CardContent>
      </Card>

      {/* Dosing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Dosing Protocols
            {data.dosing.length > 0 ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.dosing.length > 0 ? (
            <div className="space-y-4">
              {data.dosing.map((dosing, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline">{dosing.patient_type}</Badge>
                    {dosing.route && <Badge variant="secondary">{dosing.route}</Badge>}
                  </div>
                  <div className="font-medium mb-1">{dosing.indication}</div>
                  <div className="text-sm text-gray-700">{dosing.dose}</div>
                  {dosing.concentration_supplied && (
                    <div className="text-sm text-gray-600 mt-1">
                      Supplied: {dosing.concentration_supplied}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No dosing protocols added</p>
          )}
        </CardContent>
      </Card>

      {/* Administration */}
      <Card>
        <CardHeader>
          <CardTitle>Administration Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(data.administration).map(([key, items]) => {
              if (items.length === 0) return null;
              
              const titles = {
                preparation: 'Preparation',
                administration_notes: 'Administration Notes',
                monitoring: 'Monitoring',
                adverse_effects: 'Adverse Effects'
              };
              
              return (
                <div key={key}>
                  <h4 className="font-medium mb-2">{titles[key as keyof typeof titles]}</h4>
                  <ul className="space-y-1">
                    {items.map((item, index) => (
                      <li key={index} className="text-sm">• {item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
            
            {Object.values(data.administration).every(arr => arr.length === 0) && (
              <p className="text-gray-500">No administration information added</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting || !data.basic.medication_name || data.indications.length === 0 || data.dosing.length === 0}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4 mr-2" />
        )}
        {isSubmitting ? 'Adding Medication...' : 'Add Medication'}
      </Button>
    </div>
  );
};
