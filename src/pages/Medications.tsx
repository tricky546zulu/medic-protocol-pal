
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MedicationSearchContainer } from '@/components/medications/MedicationSearchContainer';
import { MedicationFilters } from '@/components/medications/MedicationFilters';
import { MedicationListContainer } from '@/components/medications/MedicationListContainer';
import { MedicationEmptyState } from '@/components/medications/MedicationEmptyState';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
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

  const totalActiveFilters = filtersHook.activeFiltersCount + (showFavoritesOnly ? 1 : 0);
  const hasActiveFilters = Boolean(searchTerm) || totalActiveFilters > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Professional Blue Header with Integrated Search */}
      <div className="bg-blue-600 text-white py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4 text-center lg:text-left">
            SK EMS Meds
          </h1>
          
          {/* Integrated Search */}
          <div className="max-w-2xl mx-auto lg:mx-0 mb-4">
            <MedicationSearchContainer
              medicationSuggestions={medicationSuggestions}
              indicationSuggestions={indicationSuggestions}
              isLoading={isLoading}
              onSearchChange={setSearchTerm}
            />
          </div>

          {/* Favorites Button */}
          {user && (
            <div className="flex justify-center lg:justify-start">
              <Button
                variant={showFavoritesOnly ? "secondary" : "outline"}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center gap-2 h-9 transition-colors ${
                  showFavoritesOnly 
                    ? 'bg-white text-blue-600 hover:bg-blue-50' 
                    : 'bg-transparent border-white/30 hover:bg-white/10 text-white'
                }`}
              >
                <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                My Favorites {userFavorites.length > 0 && `(${userFavorites.length})`}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex-1">
        {/* Filters */}
        <div className="mb-6">
          <MedicationFilters
            filters={filtersHook.filters}
            onStringFilterChange={filtersHook.handleStringFilterChange}
            onClearFilters={handleClearFilters}
            activeFiltersCount={totalActiveFilters}
          />
        </div>

        {/* Results */}
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

      {/* Subtle Footer with Disclaimer */}
      <footer className="py-6 bg-gray-100 border-t border-gray-200">
        <MedicalDisclaimer />
      </footer>
    </div>
  );
};

export default Medications;
