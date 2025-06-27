
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase, SupabaseClient } from '@/integrations/supabase/client'; // Import SupabaseClient
import { Database } from '@/integrations/supabase/types'; // Import Database type
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { PatientTypeTabs } from '@/components/medications/PatientTypeTabs';
import { MedicationDetailSkeleton } from '@/components/medications/MedicationDetailSkeleton';
import { MedicationNotFound } from '@/components/medications/MedicationNotFound';
import { MedicationHeader } from '@/components/medications/MedicationHeader';
import { ContraindicationsSection } from '@/components/medications/ContraindicationsSection';
import { CollapsibleSections } from '@/components/medications/CollapsibleSections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

// Explicit types for Supabase data
type Medication = Database['public']['Tables']['medications']['Row'];
type Indication = Database['public']['Tables']['medication_indications']['Row'];
type Contraindication = Database['public']['Tables']['medication_contraindications']['Row'];
type DosingInfo = Database['public']['Tables']['medication_dosing']['Row'];
type AdministrationInfo = Database['public']['Tables']['medication_administration']['Row'];


const MedicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Generic fetcher with explicit Supabase client and table names
  const fetchMedicationSubData = async <T extends keyof Database['public']['Tables']>(
    tableName: T,
    select = '*'
  ): Promise<Database['public']['Tables'][T]['Row'][] | null> => {
    const { data, error } = await (supabase as SupabaseClient<Database>) // Type assertion
      .from(tableName)
      .select(select)
      .eq('medication_id', id);

    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      toast({
        title: `Error loading ${String(tableName).replace(/_/g, ' ')}`,
        description: error.message || "Could not fetch data.",
        variant: "destructive",
      });
      throw error; // Re-throw to be caught by useQuery's error state
    }
    return data;
  };


  const { data: medication, isLoading: medicationLoading, error: medicationError } = useQuery<Medication, Error>({
    queryKey: ['medication', id],
    queryFn: async () => {
      const { data, error } = await (supabase as SupabaseClient<Database>)
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

  const { data: indications } = useQuery<Indication[] | null, Error>({
    queryKey: ['medication-indications', id],
    queryFn: () => fetchMedicationSubData('medication_indications'),
    enabled: !!id && !!medication,
  });

  const { data: contraindications } = useQuery<Contraindication[] | null, Error>({
    queryKey: ['medication-contraindications', id],
    queryFn: () => fetchMedicationSubData('medication_contraindications'),
    enabled: !!id && !!medication,
  });

  const { data: dosing } = useQuery<DosingInfo[] | null, Error>({
    queryKey: ['medication-dosing', id],
    queryFn: async () => {
      const { data, error } = await (supabase as SupabaseClient<Database>)
        .from('medication_dosing')
        .select('*')
        .eq('medication_id', id)
        .order('patient_type');
      if (error) {
        toast({
            title: "Error Loading Dosing Info",
            description: error.message || "Could not fetch dosing information.",
            variant: "destructive",
        });
        throw error;
      }
      return data;
    },
    enabled: !!id && !!medication,
  });

  const { data: administration } = useQuery<AdministrationInfo | null, Error>({
    queryKey: ['medication-administration', id],
    queryFn: async () => {
      const result = await fetchMedicationSubData('medication_administration');
      return result?.[0] || null; // Expecting a single row or none
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
