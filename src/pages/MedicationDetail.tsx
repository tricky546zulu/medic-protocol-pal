
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, AlertTriangleIcon } from 'lucide-react';
import { PatientTypeTabs } from '@/components/medications/PatientTypeTabs';
import { MedicationDetailSkeleton } from '@/components/medications/MedicationDetailSkeleton';
import { MedicationNotFound } from '@/components/medications/MedicationNotFound';
import { MedicationHeader } from '@/components/medications/MedicationHeader';
import { ContraindicationsSection } from '@/components/medications/ContraindicationsSection';
import { CollapsibleSections } from '@/components/medications/CollapsibleSections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import type { Database } from '@/integrations/supabase/types';

type TableName = 'medication_indications' | 'medication_contraindications' | 'medication_dosing' | 'medication_administration';

const MedicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchMedicationData = async (tableName: TableName, select = '*') => {
    const { data, error } = await supabase
      .from(tableName)
      .select(select)
      .eq('medication_id', id);
    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      toast({
        title: `Error loading ${tableName.replace(/_/g, ' ')}`,
        description: error.message || "Could not fetch data.",
        variant: "destructive",
      });
      throw error;
    }
    return data;
  };

  const { data: medication, isLoading: medicationLoading, error: medicationError } = useQuery({
    queryKey: ['medication', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching medication details:", error);
        if (error.code === 'PGRST116') {
             throw new Error("Medication not found");
        }
        toast({
            title: "Error Loading Medication",
            description: error.message || "Could not fetch medication details.",
            variant: "destructive",
        });
        throw error;
      }
      return data;
    },
    enabled: !!id,
    retry: 1,
  });

  const { data: indications } = useQuery({
    queryKey: ['medication-indications', id],
    queryFn: () => fetchMedicationData('medication_indications'),
    enabled: !!id && !!medication,
  });

  const { data: contraindications } = useQuery({
    queryKey: ['medication-contraindications', id],
    queryFn: () => fetchMedicationData('medication_contraindications'),
    enabled: !!id && !!medication,
  });

  const { data: dosing } = useQuery({
    queryKey: ['medication-dosing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medication_dosing')
        .select('*')
        .eq('medication_id', id)
        .order('patient_type');
      if (error) {
        console.error('Error fetching dosing:', error);
        toast({
          title: "Error loading dosing information",
          description: error.message || "Could not fetch dosing data.",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
    enabled: !!id && !!medication,
  });

  const { data: administration } = useQuery({
    queryKey: ['medication-administration', id],
    queryFn: async () => {
      const data = await fetchMedicationData('medication_administration');
      return data?.[0];
    },
    enabled: !!id && !!medication,
  });

  const handleBackClick = () => navigate(-1);

  if (medicationLoading) {
    return <MedicationDetailSkeleton />;
  }

  if (medicationError || !medication) {
    return <MedicationNotFound onBackClick={handleBackClick} error={medicationError?.message} />;
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Button>

        <MedicationHeader medication={medication} />

        {dosing && dosing.length > 0 ? (
          <Card className="mb-6 sm:mb-8 shadow-md">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
                {medication.infusion_only ? 'Infusion Protocol' : 'Emergency Dosing Protocol'}
              </CardTitle>
              <p className="text-sm text-muted-foreground pt-1">
                Select patient type for specific dosing information.
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <PatientTypeTabs
                dosing={dosing}
                isHighAlert={medication.high_alert || false}
                isInfusionOnly={medication.infusion_only || false}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 sm:mb-8 border-dashed">
             <CardContent className="p-6 text-center text-muted-foreground">
                No dosing information available for this medication.
             </CardContent>
          </Card>
        )}

        <ContraindicationsSection contraindications={contraindications || []} />

        {!medication.infusion_only && (
          <CollapsibleSections
            indications={indications || []}
            administration={administration}
          />
        )}
      </div>
    </div>
  );
};

export default MedicationDetail;
