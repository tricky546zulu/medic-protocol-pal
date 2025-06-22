
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MedicationSearchContainer } from '@/components/medications/MedicationSearchContainer';
import { MedicationFilters } from '@/components/medications/MedicationFilters';
import { EmergencyCategories } from '@/components/medications/EmergencyCategories';
import { MedicationListContainer } from '@/components/medications/MedicationListContainer';
import { MedicationEmptyState } from '@/components/medications/MedicationEmptyState';
import { useMedicationData } from '@/hooks/useMedicationData';
import { useMedicationFilters } from '@/hooks/useMedicationFilters';
import { useFavorites } from '@/hooks/useFavorites';

const Medications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { user } = useAuth();

  const { medications, dosingData, indicationData, isLoading } = useMedicationData();
  const { userFavorites } = useFavorites();

  const filtersHook = useMedicationFilters({
    medications,
    dosingData,
    indicationData,
    searchTerm,
    showFavoritesOnly,
    userFavorites,
  });

  const medicationSuggestions = useMemo(() => {
    return medications.map(med => med.medication_name);
  }, [medications]);

  const indicationSuggestions = useMemo(() => {
    if (!indicationData || !medications) return [];
    
    return indicationData.map(indication => {
      const medication = medications.find(med => med.id === indication.medication_id);
      return {
        text: indication.indication_text,
        medicationId: indication.medication_id,
        medicationName: medication?.medication_name || ''
      };
    });
  }, [indicationData, medications]);

  const handleClearFilters = () => {
    filtersHook.clearFilters();
    setSearchTerm('');
    setShowFavoritesOnly(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSearchTerm('');
    filtersHook.handleCategorySelect(categoryId);
    setShowFavoritesOnly(false);
  };

  const totalActiveFilters = filtersHook.activeFiltersCount + (showFavoritesOnly ? 1 : 0);
  const hasActiveFilters = searchTerm || totalActiveFilters > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Saskatchewan EMS Medications
        </h1>
        <p className="text-gray-600 mb-6">
          Provincial medication protocols and dosing guidelines for emergency medical services
        </p>
        
        <div className="max-w-2xl mb-6">
          <MedicationSearchContainer
            medicationSuggestions={medicationSuggestions}
            indicationSuggestions={indicationSuggestions}
            isLoading={isLoading}
            onSearchChange={setSearchTerm}
          />
        </div>

        {user && (
          <div className="mb-4">
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="flex items-center gap-2 touch-manipulation min-h-[44px]"
            >
              <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              My Favorites {userFavorites.length > 0 && `(${userFavorites.length})`}
            </Button>
          </div>
        )}
      </div>

      <EmergencyCategories onCategorySelect={handleCategorySelect} />

      <MedicationFilters
        filters={filtersHook.filters}
        onStringFilterChange={filtersHook.handleStringFilterChange}
        onClearFilters={handleClearFilters}
        activeFiltersCount={totalActiveFilters}
      />

      {filtersHook.filteredMedications.length === 0 && !isLoading ? (
        <MedicationEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <MedicationListContainer
          medications={filtersHook.filteredMedications}
          isLoading={isLoading}
          activeFiltersCount={totalActiveFilters}
        />
      )}
    </div>
  );
};

export default Medications;
