
import React from 'react';
import { MedicationSearch } from './MedicationSearch';
import { MedicationFilters } from './MedicationFilters';
import { EmergencyCategories } from './EmergencyCategories';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import { useMedicationSearch } from '@/hooks/useMedicationSearch';
import { useMedicationFilters } from '@/hooks/useMedicationFilters';

export const MedicationSearchContainer = () => {
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearchActive,
    clearSearch
  } = useMedicationSearch();

  const {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters
  } = useMedicationFilters();

  return (
    <div className="space-y-6">
      <MedicalDisclaimer />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <MedicationFilters
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <MedicationSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClearSearch={clearSearch}
            searchResults={searchResults}
            isSearchActive={isSearchActive}
          />
          
          {!isSearchActive && !hasActiveFilters && <EmergencyCategories />}
        </div>
      </div>
    </div>
  );
};
