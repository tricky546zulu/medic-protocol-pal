
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { TestTube } from 'lucide-react';

export const CreateTestMedication = () => {
  const createTestMedication = async () => {
    try {
      console.log('Creating test medication with pump settings...');
      
      // Create medication
      const { data: medication, error: medicationError } = await supabase
        .from('medications')
        .insert({
          medication_name: 'Test Epinephrine (IV Pump)',
          classification: ['Vasopressor', 'Cardiac Stimulant'],
          high_alert: true,
        })
        .select()
        .single();

      if (medicationError) throw medicationError;

      // Create indication
      const { error: indicationError } = await supabase
        .from('medication_indications')
        .insert({
          medication_id: medication.id,
          indication_type: 'Primary',
          indication_text: 'Cardiac arrest, severe hypotension',
        });

      if (indicationError) throw indicationError;

      // Create contraindication
      const { error: contraindicationError } = await supabase
        .from('medication_contraindications')
        .insert({
          medication_id: medication.id,
          contraindication: 'Hypertrophic cardiomyopathy with outflow obstruction',
        });

      if (contraindicationError) throw contraindicationError;

      // Create dosing with pump settings
      const pumpSettings = {
        medication_selection: 'Epinephrine 1:10,000 (0.1 mg/mL) - 10 mL prefilled syringe',
        cca_setting: '0.1 mcg/kg/min',
        line_option: 'A',
        duration: '30 minutes',
        vtbi: '250 mL',
        pump_instructions: 'Monitor blood pressure every 2 minutes. Titrate based on patient response.',
      };

      const { error: dosingError } = await supabase
        .from('medication_dosing')
        .insert({
          medication_id: medication.id,
          patient_type: 'Adult',
          indication: 'Cardiac arrest with return of spontaneous circulation',
          dose: '0.1-0.5 mcg/kg/min IV infusion. Titrate to effect.',
          route: 'IV',
          provider_routes: ['ACP', 'CCP'],
          concentration_supplied: '1 mg/mL (1:1000), 0.1 mg/mL (1:10000)',
          compatibility_stability: ['Compatible with NS', 'Protect from light'],
          notes: ['Monitor for extravasation', 'Use central line if available'],
          requires_infusion_pump: true,
          infusion_pump_settings: pumpSettings,
        });

      if (dosingError) throw dosingError;

      // Create administration
      const { error: adminError } = await supabase
        .from('medication_administration')
        .insert({
          medication_id: medication.id,
          preparation: ['Dilute in 250mL NS', 'Use infusion pump'],
          administration_notes: ['Start with lowest dose', 'Titrate slowly'],
          monitoring: ['Blood pressure', 'Heart rate', 'ECG'],
          adverse_effects: ['Hypertension', 'Tachycardia', 'Arrhythmias'],
        });

      if (adminError) throw adminError;

      toast({
        title: "Success",
        description: "Test medication with pump settings created successfully",
      });

      console.log('Test medication created successfully with ID:', medication.id);
    } catch (error: any) {
      console.error('Error creating test medication:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create test medication",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TestTube className="h-4 w-4" />
          Development Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={createTestMedication} variant="outline" size="sm">
          Create Test Medication (with Pump Settings)
        </Button>
        <p className="text-xs text-gray-600 mt-2">
          This creates a test medication with infusion pump settings for testing purposes.
        </p>
      </CardContent>
    </Card>
  );
};
