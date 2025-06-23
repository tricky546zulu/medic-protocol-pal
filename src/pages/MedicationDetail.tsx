
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-violet-50 to-sky-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-blue-50/40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(221,214,254,0.1),transparent_50%)]"></div>
      
      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="mb-8 flex items-center gap-3 bg-white/70 backdrop-blur-lg border border-white/30 hover:bg-white/80 rounded-lg transition-all duration-300 shadow-lg h-12 px-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Medications
        </Button>

        <MedicationHeader medication={medication} />

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

        <ContraindicationsSection contraindications={contraindications || []} />

        <CollapsibleSections indications={indications} administration={administration} />
      </div>
    </div>
  );
};

export default MedicationDetail;
