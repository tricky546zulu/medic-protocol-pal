
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, AlertTriangleIcon } from 'lucide-react'; // Updated Icons
import { PatientTypeTabs } from '@/components/medications/PatientTypeTabs';
import { MedicationDetailSkeleton } from '@/components/medications/MedicationDetailSkeleton';
import { MedicationNotFound } from '@/components/medications/MedicationNotFound';
import { MedicationHeader } from '@/components/medications/MedicationHeader';
import { ContraindicationsSection } from '@/components/medications/ContraindicationsSection';
import { CollapsibleSections } from '@/components/medications/CollapsibleSections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
import { toast } from '@/components/ui/use-toast'; // Import toast

const MedicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchMedicationData = async (tableName: string, select = '*') => {
    const { data, error } = await supabase
      .from(tableName)
      .select(select)
      .eq('medication_id', id);
    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      toast({ // Add toast for individual fetch errors
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
        // Specific toast for main medication fetch failure
        if (error.code === 'PGRST116') { // Not found error
             throw new Error("Medication not found"); // Let this propagate to MedicationNotFound
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
    retry: 1, // Retry once for network issues
  });

  const { data: indications } = useQuery({
    queryKey: ['medication-indications', id],
    queryFn: () => fetchMedicationData('medication_indications'),
    enabled: !!id && !!medication, // Only fetch if medication is loaded
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
        .order('patient_type'); // Keep order for tabs
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!medication,
  });

  const { data: administration } = useQuery({
    queryKey: ['medication-administration', id],
    queryFn: async () => {
      const data = await fetchMedicationData('medication_administration');
      return data?.[0]; // Expecting a single row or none
    },
    enabled: !!id && !!medication,
  });

  const handleBackClick = () => navigate(-1); // Go back to previous page

  if (medicationLoading) {
    return <MedicationDetailSkeleton />;
  }

  // Handle general fetch error for the main medication, or if it's not found after loading
  if (medicationError || !medication) {
    return <MedicationNotFound onBackClick={handleBackClick} error={medicationError?.message} />;
  }

  return (
    <div className="min-h-screen bg-background pb-12"> {/* Use theme background, add padding bottom */}
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl"> {/* Responsive padding and max-width */}
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Button>

        <MedicationHeader medication={medication} />

        {/* Main Dosing Section */}
        {dosing && dosing.length > 0 ? (
          <Card className="mb-6 sm:mb-8 shadow-md"> {/* Consistent margin */}
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
                isHighAlert={medication.high_alert || false} // Ensure boolean
                isInfusionOnly={medication.infusion_only || false} // Ensure boolean
              />
            </CardContent>
          </Card>
        ) : (
          // Optional: Show a placeholder if dosing info is expected but not available
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
