
import React, { useState } from 'react';
import { MedicationSearch } from './MedicationSearch';
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

  return (
    <div className="space-y-6">
      <MedicalDisclaimer />
      
      <MedicationSearch
        value={searchTerm}
        onChange={handleSearchChange}
        suggestions={medicationSuggestions}
        isLoading={isLoading}
        indicationSuggestions={indicationSuggestions}
      />
    </div>
  );
};
