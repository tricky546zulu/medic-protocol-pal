
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MedicationSearchContainer } from '@/components/medications/MedicationSearchContainer';
import { MedicationFilters } from '@/components/medications/MedicationFilters';
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

  const totalActiveFilters = filtersHook.activeFiltersCount + (showFavoritesOnly ? 1 : 0);
  const hasActiveFilters = Boolean(searchTerm) || totalActiveFilters > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Medication Database
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            Provincial emergency medical services protocols and dosing guidelines
          </p>
          
          {/* Search Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="max-w-2xl mx-auto lg:mx-0 mb-6">
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
                  className="flex items-center gap-2 touch-manipulation min-h-[44px] rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                  My Favorites {userFavorites.length > 0 && `(${userFavorites.length})`}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
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
    </div>
  );
};

export default Medications;
