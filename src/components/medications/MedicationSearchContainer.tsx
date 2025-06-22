
import React from 'react';
import { MedicationSearch } from './MedicationSearch';
import { useMedicationSearch } from '@/hooks/useMedicationSearch';

interface MedicationSearchContainerProps {
  medicationSuggestions: string[];
  indicationSuggestions: Array<{ text: string; medicationId: string }>;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
}

export const MedicationSearchContainer = ({
  medicationSuggestions,
  indicationSuggestions,
  isLoading,
  onSearchChange,
}: MedicationSearchContainerProps) => {
  const searchHook = useMedicationSearch({
    medicationSuggestions,
    indicationSuggestions,
  });

  const handleSearchChange = (value: string) => {
    searchHook.handleSearchChange(value);
    onSearchChange(value);
  };

  return (
    <MedicationSearch
      value={searchHook.searchTerm}
      onChange={handleSearchChange}
      suggestions={medicationSuggestions}
      indicationSuggestions={indicationSuggestions}
      isLoading={isLoading}
    />
  );
};
