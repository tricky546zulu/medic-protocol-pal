
import React, { useState, useMemo } from 'react';
import { MedicationSearch } from './MedicationSearch';

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

  const filteredMedicationSuggestions = useMemo(() => {
    if (!searchTerm) return medicationSuggestions.slice(0, 10);
    return medicationSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 20);
  }, [medicationSuggestions, searchTerm]);

  const filteredIndicationSuggestions = useMemo(() => {
    if (!searchTerm) return indicationSuggestions.slice(0, 10);
    return indicationSuggestions.filter(suggestion =>
      suggestion.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.medicationName.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 20);
  }, [indicationSuggestions, searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <MedicationSearch
      value={searchTerm}
      onChange={handleSearchChange}
      suggestions={filteredMedicationSuggestions}
      isLoading={isLoading}
      indicationSuggestions={filteredIndicationSuggestions}
    />
  );
};
