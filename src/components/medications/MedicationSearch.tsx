
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMedicationSearch } from '@/hooks/useMedicationSearch';

interface MedicationSearchProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  isLoading?: boolean;
  indicationSuggestions?: Array<{ text: string; medicationId: string }>;
}

export const MedicationSearch = ({ 
  value, 
  onChange, 
  suggestions, 
  isLoading,
  indicationSuggestions = []
}: MedicationSearchProps) => {
  const searchHook = useMedicationSearch({
    medicationSuggestions: suggestions,
    indicationSuggestions,
  });

  // Sync external value with internal search hook
  useEffect(() => {
    if (value !== searchHook.searchTerm) {
      searchHook.handleSearchChange(value);
    }
  }, [value]);

  const handleChange = (newValue: string) => {
    searchHook.handleSearchChange(newValue);
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion: any) => {
    searchHook.handleSuggestionSelect(suggestion);
    onChange(suggestion.text);
  };

  const handleClear = () => {
    searchHook.clearSearch();
    onChange('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search medications or indications..."
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="pl-12 pr-20 text-lg h-14 text-base touch-manipulation"
          onFocus={() => {
            if (value.length > 1) {
              searchHook.setShowSuggestions(searchHook.combinedSuggestions.length > 0);
            } else if (searchHook.recentSearches.length > 0) {
              searchHook.setShowSuggestions(true);
            }
          }}
          onBlur={() => setTimeout(() => searchHook.setShowSuggestions(false), 200)}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
          {searchHook.isVoiceSearchSupported && (
            <button
              onClick={searchHook.handleVoiceSearch}
              className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
              type="button"
            >
              <Mic className="h-5 w-5" />
            </button>
          )}
          {value && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {searchHook.showSuggestions && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {searchHook.showRecentSearches ? (
              <>
                <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">
                  Recent Searches
                </div>
                {searchHook.recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 touch-manipulation min-h-[48px] flex items-center"
                    onClick={() => handleSuggestionClick({ text: search, type: 'medication' })}
                  >
                    <Search className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-base">{search}</span>
                  </div>
                ))}
              </>
            ) : (
              searchHook.combinedSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 touch-manipulation min-h-[48px] flex items-center justify-between"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-base truncate">
                      {suggestion.text.replace(
                        new RegExp(`(${value})`, 'gi'),
                        '<strong>$1</strong>'
                      )}
                    </span>
                  </div>
                  <Badge 
                    variant={suggestion.type === 'medication' ? 'default' : 'secondary'}
                    className="ml-2 flex-shrink-0"
                  >
                    {suggestion.type === 'medication' ? 'Drug' : 'Use'}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
