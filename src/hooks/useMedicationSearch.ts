
import { useState, useMemo, useEffect, useCallback } from 'react';
import { searchService } from '@/services/searchService';
import type { SearchSuggestion } from '@/services/searchService';

interface UseMedicationSearchProps {
  medicationSuggestions: string[];
  indicationSuggestions: Array<{ text: string; medicationId: string }>;
}

export const useMedicationSearch = ({ 
  medicationSuggestions, 
  indicationSuggestions 
}: UseMedicationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(searchService.getRecentSearches());
  }, []);

  const combinedSuggestions = useMemo((): SearchSuggestion[] => {
    return searchService.generateSuggestions(
      searchTerm,
      medicationSuggestions,
      indicationSuggestions
    );
  }, [searchTerm, medicationSuggestions, indicationSuggestions]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (value.length > 0) {
      // Recalculate suggestions based on the new 'value' for immediate feedback
      const currentSuggestions = searchService.generateSuggestions(
        value,
        medicationSuggestions,
        indicationSuggestions
      );
      // Show suggestions if there are any and search term is longer than 1 char
      setShowSuggestions(currentSuggestions.length > 0 && value.length > 1);
    } else {
      // Hide suggestions if search term is empty
      setShowSuggestions(false);
    }
  }, [medicationSuggestions, indicationSuggestions]); // Added dependencies

  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);
    
    searchService.addRecentSearch(suggestion.text);
    setRecentSearches(searchService.getRecentSearches());
  }, []); // No external dependencies from props/state other than setters

  const handleVoiceSearch = useCallback(() => {
    searchService.startVoiceRecognition((transcript) => {
      setSearchTerm(transcript);
      // Optionally, trigger a search or suggestion update here as well
      // handleSearchChange(transcript);
    });
  }, []); // handleSearchChange could be a dependency if used

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setShowSuggestions(false);
  }, []);

  const showRecentSearches = !searchTerm && recentSearches.length > 0;

  return {
    searchTerm,
    showSuggestions,
    combinedSuggestions,
    recentSearches,
    showRecentSearches,
    isVoiceSearchSupported: searchService.isVoiceSearchSupported(),
    handleSearchChange,
    handleSuggestionSelect,
    handleVoiceSearch,
    clearSearch,
    setShowSuggestions,
  };
};
