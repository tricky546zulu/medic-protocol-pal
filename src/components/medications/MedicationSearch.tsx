
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchSuggestion {
  text: string;
  type: 'medication' | 'indication';
  medicationId?: string;
}

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [combinedSuggestions, setCombinedSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('medication-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (value.length > 0) {
      const medicationSuggestions: SearchSuggestion[] = suggestions
        .filter(suggestion => suggestion.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 3)
        .map(text => ({ text, type: 'medication' }));

      const indicationSuggestionsList: SearchSuggestion[] = indicationSuggestions
        .filter(suggestion => suggestion.text.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 3)
        .map(suggestion => ({ 
          text: suggestion.text, 
          type: 'indication',
          medicationId: suggestion.medicationId 
        }));

      const combined = [...medicationSuggestions, ...indicationSuggestionsList]
        .slice(0, 6);

      setCombinedSuggestions(combined);
      setShowSuggestions(combined.length > 0 && value.length > 1);
    } else {
      setShowSuggestions(false);
    }
  }, [value, suggestions, indicationSuggestions]);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    setShowSuggestions(false);
    
    // Add to recent searches
    const newRecentSearches = [suggestion.text, ...recentSearches.filter(s => s !== suggestion.text)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('medication-recent-searches', JSON.stringify(newRecentSearches));
  };

  const clearSearch = () => {
    onChange('');
    setShowSuggestions(false);
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChange(transcript);
      };
      
      recognition.start();
    }
  };

  const showRecentSearches = !value && recentSearches.length > 0;

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search medications or indications..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 pr-20 text-lg h-14 text-base touch-manipulation"
          onFocus={() => {
            if (value.length > 1) {
              setShowSuggestions(combinedSuggestions.length > 0);
            } else if (recentSearches.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
          {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
            <button
              onClick={handleVoiceSearch}
              className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
              type="button"
            >
              <Mic className="h-5 w-5" />
            </button>
          )}
          {value && (
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {showRecentSearches ? (
              <>
                <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
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
              combinedSuggestions.map((suggestion, index) => (
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
