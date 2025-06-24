import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PatientTypeTabs } from '@/components/medications/PatientTypeTabs';
import { QuickReferenceCard } from '@/components/medications/QuickReferenceCard';
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="mb-8 flex items-center gap-3 bg-white border border-gray-200 hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Medications
        </Button>

        <MedicationHeader medication={medication} />

        {/* Emergency Dosing Section */}
        {dosing && dosing.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-6 text-center text-gray-800">
              {medication.infusion_only ? 'Infusion Protocol' : 'Emergency Dosing'}
            </h2>
            <PatientTypeTabs 
              dosing={dosing} 
              isHighAlert={medication.high_alert} 
              isInfusionOnly={medication.infusion_only}
            />
          </div>
        )}

        {/* Quick Reference Section - Only show for non-infusion-only medications */}
        {!medication.infusion_only && (
          <div className="mb-10">
            <QuickReferenceCard medication={medication} dosing={dosing || []} />
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
