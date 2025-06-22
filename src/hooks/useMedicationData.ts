
import { useQuery } from '@tanstack/react-query';
import { medicationService } from '@/services/medicationService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/constants/appConstants';

export const useMedicationData = () => {
  const medicationsQuery = useQuery({
    queryKey: queryKeys.medications.list(),
    queryFn: medicationService.getAllMedications,
    staleTime: QUERY_STALE_TIME.MEDICATIONS,
  });

  const dosingQuery = useQuery({
    queryKey: queryKeys.dosing.allDosing(),
    queryFn: medicationService.getAllDosing,
    staleTime: QUERY_STALE_TIME.STATIC_DATA,
  });

  const indicationsQuery = useQuery({
    queryKey: queryKeys.indications.allIndications(),
    queryFn: medicationService.getAllIndications,
    staleTime: QUERY_STALE_TIME.STATIC_DATA,
  });

  return {
    medications: medicationsQuery.data || [],
    dosingData: dosingQuery.data || [],
    indicationData: indicationsQuery.data || [],
    isLoading: medicationsQuery.isLoading || dosingQuery.isLoading || indicationsQuery.isLoading,
    error: medicationsQuery.error || dosingQuery.error || indicationsQuery.error,
  };
};
