
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-violet-50 to-sky-100 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Medication Database
          </h1>
          <p className="text-base text-gray-600 mb-6 max-w-2xl">
            Provincial emergency medical services protocols and dosing guidelines
          </p>
          
          {/* Search Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="max-w-2xl mx-auto lg:mx-0 mb-4">
              <MedicationSearchContainer
                medicationSuggestions={medicationSuggestions}
                indicationSuggestions={indicationSuggestions}
                isLoading={isLoading}
                onSearchChange={setSearchTerm}
              />
            </div>

            {user && (
              <div className="flex justify-center lg:justify-start">
                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center gap-2 h-9 transition-colors ${
                    showFavoritesOnly 
                      ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                      : 'bg-white border-rose-200 hover:bg-rose-50 text-rose-700'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                  My Favorites {userFavorites.length > 0 && `(${userFavorites.length})`}
                </Button>
              </div>
            )}
          </div>
        </div>

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

      {/* Footer with Disclaimer */}
      <footer className="py-8 bg-white border-t border-gray-200">
        <MedicalDisclaimer />
      </footer>
    </div>
  );
};

export default Medications;
