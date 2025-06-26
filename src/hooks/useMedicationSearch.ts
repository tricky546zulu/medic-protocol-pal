
import { useState, useMemo, useEffect } from 'react';
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
      setShowSuggestions(combinedSuggestions.length > 0 && value.length > 1);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);
    
    searchService.addRecentSearch(suggestion.text);
    setRecentSearches(searchService.getRecentSearches());
  };

  const handleVoiceSearch = () => {
    searchService.startVoiceRecognition((transcript) => {
      setSearchTerm(transcript);
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

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
