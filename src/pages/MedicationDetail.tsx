
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PatientTypeTabs } from '@/components/medications/PatientTypeTabs';
import { MedicationDetailSkeleton } from '@/components/medications/MedicationDetailSkeleton';
import { MedicationNotFound } from '@/components/medications/MedicationNotFound';
import { MedicationHeader } from '@/components/medications/MedicationHeader';
import { ContraindicationsSection } from '@/components/medications/ContraindicationsSection';
import { CollapsibleSections } from '@/components/medications/CollapsibleSections';

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

  const handleBackClick = () => navigate('/medications');

  if (medicationLoading) {
    return <MedicationDetailSkeleton />;
  }

  if (!medication) {
    return <MedicationNotFound onBackClick={handleBackClick} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Medications
        </Button>

        <MedicationHeader medication={medication} />

        {/* Main Dosing Section - Single, Clean Display */}
        {dosing && dosing.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {medication.infusion_only ? 'Infusion Protocol' : 'Emergency Dosing Protocol'}
                </h2>
                <p className="text-sm text-gray-600">
                  Select patient type to view specific dosing information
                </p>
              </div>
              <div className="p-6">
                <PatientTypeTabs 
                  dosing={dosing} 
                  isHighAlert={medication.high_alert} 
                  isInfusionOnly={medication.infusion_only}
                />
              </div>
            </div>
          </div>
        )}

        <ContraindicationsSection contraindications={contraindications || []} />

        {/* Only show detailed sections for non-infusion-only medications */}
        {!medication.infusion_only && (
          <CollapsibleSections indications={indications} administration={administration} />
        )}
      </div>
    </div>
  );
};

export default MedicationDetail;
