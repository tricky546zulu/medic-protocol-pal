
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-violet-50 to-sky-100 relative overflow-hidden">
      {/* Enhanced background texture */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-blue-50/40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(221,214,254,0.1),transparent_50%)]"></div>
      
      <div className="relative container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Medication Database
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl font-medium">
            Provincial emergency medical services protocols and dosing guidelines
          </p>
          
          {/* Enhanced Search Section */}
          <div className="bg-white/85 backdrop-blur-lg rounded-3xl shadow-2xl shadow-violet-200/60 p-8 mb-8 ring-1 ring-violet-200/30 hover:ring-violet-300/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-300/70">
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
                  className={`flex items-center gap-2 touch-manipulation min-h-[44px] rounded-2xl shadow-lg transition-all duration-200 ${
                    showFavoritesOnly 
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-300/50 hover:shadow-rose-400/60' 
                      : 'bg-white/80 backdrop-blur-sm border-rose-200/60 hover:border-rose-300/80 text-rose-700 hover:text-rose-800 shadow-rose-200/40 hover:shadow-rose-300/50'
                  } hover:scale-105`}
                >
                  <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                  My Favorites {userFavorites.length > 0 && `(${userFavorites.length})`}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Filters */}
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
