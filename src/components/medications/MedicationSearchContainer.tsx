
import React, { useState } from 'react';
import { MedicationSearch } from './MedicationSearch';
import { MedicationFilters } from './MedicationFilters';
import { EmergencyCategories } from './EmergencyCategories';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';

interface MedicationSearchContainerProps {
  medicationSuggestions: string[];
  indicationSuggestions: Array<{ text: string; medicationId: string; medicationName: string }>;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
}

export const MedicationSearchContainer = ({
  medicationSuggestions,
  indicationSuggestions,
  isLoading,
  onSearchChange
}: MedicationSearchContainerProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearchChange('');
  };

  const handleCategorySelect = (categoryId: string) => {
    // This could trigger filter changes in the parent component
    console.log('Category selected:', categoryId);
  };

  return (
    <div className="space-y-6">
      <MedicalDisclaimer />
      
      <div className="space-y-6">
        <MedicationSearch
          value={searchTerm}
          onChange={handleSearchChange}
          suggestions={medicationSuggestions}
          isLoading={isLoading}
          indicationSuggestions={indicationSuggestions}
        />
        
        {!searchTerm && <EmergencyCategories onCategorySelect={handleCategorySelect} />}
      </div>
    </div>
  );
};
