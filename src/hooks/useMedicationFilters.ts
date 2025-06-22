
import { useState, useMemo } from 'react';
import { medicationService } from '@/services/medicationService';
import type { Database } from '@/integrations/supabase/types';

type Medication = Database['public']['Tables']['medications']['Row'];
type DosingData = Database['public']['Tables']['medication_dosing']['Row'];
type IndicationData = Database['public']['Tables']['medication_indications']['Row'];

interface FilterState {
  patientType: string;
  classification: string;
  highAlert: boolean;
  route: string;
}

interface UseMedicationFiltersProps {
  medications: Medication[];
  dosingData: DosingData[];
  indicationData: IndicationData[];
  searchTerm: string;
  showFavoritesOnly: boolean;
  userFavorites?: string[];
}

interface UseMedicationFiltersReturn {
  filters: FilterState;
  filteredMedications: Medication[];
  activeFiltersCount: number;
  handleStringFilterChange: (key: 'patientType' | 'classification' | 'route', value: string) => void;
  handleHighAlertToggle: (value: boolean) => void;
  clearFilters: () => void;
  handleCategorySelect: (categoryId: string) => void;
}

export const useMedicationFilters = ({
  medications,
  dosingData,
  indicationData,
  searchTerm,
  showFavoritesOnly,
  userFavorites = [],
}: UseMedicationFiltersProps): UseMedicationFiltersReturn => {
  const [filters, setFilters] = useState<FilterState>({
    patientType: 'all',
    classification: 'all',
    highAlert: false,
    route: 'all',
  });

  const filteredMedications = useMemo(() => {
    let filtered = medications;

    // Favorites filter
    if (showFavoritesOnly && userFavorites) {
      filtered = filtered.filter(med => userFavorites.includes(med.id));
    }

    // Search filter
    if (searchTerm) {
      filtered = medicationService.searchMedications(searchTerm, filtered, indicationData);
    }

    // High alert filter
    if (filters.highAlert) {
      filtered = filtered.filter(med => med.high_alert);
    }

    // Classification filter
    if (filters.classification !== 'all') {
      filtered = filtered.filter(med =>
        med.classification?.some(cls => 
          cls.toLowerCase().includes(filters.classification.toLowerCase())
        )
      );
    }

    // Patient type and route filters
    if (dosingData && (filters.patientType !== 'all' || filters.route !== 'all')) {
      const medicationIds = new Set();
      
      dosingData.forEach(dosing => {
        const matchesPatientType = filters.patientType === 'all' || dosing.patient_type === filters.patientType;
        const matchesRoute = filters.route === 'all' || dosing.route === filters.route;
        
        if (matchesPatientType && matchesRoute) {
          medicationIds.add(dosing.medication_id);
        }
      });

      filtered = filtered.filter(med => medicationIds.has(med.id));
    }

    return filtered;
  }, [medications, searchTerm, filters, dosingData, indicationData, showFavoritesOnly, userFavorites]);

  // Separate handlers with explicit signatures
  const handleStringFilterChange = (key: 'patientType' | 'classification' | 'route', value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleHighAlertToggle = (value: boolean) => {
    setFilters(prev => ({ ...prev, highAlert: value }));
  };

  const clearFilters = () => {
    setFilters({
      patientType: 'all',
      classification: 'all',
      highAlert: false,
      route: 'all',
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    switch (categoryId) {
      case 'cardiac-arrest':
        setFilters(prev => ({ ...prev, classification: 'Cardiac' }));
        break;
      case 'respiratory':
        setFilters(prev => ({ ...prev, classification: 'Respiratory' }));
        break;
      case 'seizure':
        setFilters(prev => ({ ...prev, classification: 'Anticonvulsant' }));
        break;
      case 'arrhythmia':
        setFilters(prev => ({ ...prev, classification: 'Antiarrhythmic' }));
        break;
      case 'pediatric':
        setFilters(prev => ({ ...prev, patientType: 'Pediatric' }));
        break;
      case 'high-alert':
        setFilters(prev => ({ ...prev, highAlert: true }));
        break;
    }
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== 'all' && value !== false
  ).length;

  return {
    filters,
    filteredMedications,
    activeFiltersCount,
    handleStringFilterChange,
    handleHighAlertToggle,
    clearFilters,
    handleCategorySelect,
  };
};
