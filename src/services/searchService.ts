
import { LOCAL_STORAGE_KEYS, SEARCH_LIMITS } from '@/constants/appConstants';

export interface SearchSuggestion {
  text: string;
  type: 'medication' | 'indication';
  medicationId?: string;
}

export const searchService = {
  getRecentSearches(): string[] {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.RECENT_SEARCHES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  addRecentSearch(searchTerm: string): void {
    try {
      const recentSearches = this.getRecentSearches();
      const newRecentSearches = [
        searchTerm, 
        ...recentSearches.filter(s => s !== searchTerm)
      ].slice(0, SEARCH_LIMITS.RECENT_SEARCHES);
      
      localStorage.setItem(LOCAL_STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(newRecentSearches));
    } catch {
      // Fail silently if localStorage is not available
    }
  },

  generateSuggestions(
    searchTerm: string,
    medicationSuggestions: string[],
    indicationSuggestions: Array<{ text: string; medicationId: string }>
  ): SearchSuggestion[] {
    if (!searchTerm) return [];

    const searchLower = searchTerm.toLowerCase();

    const medSuggestions: SearchSuggestion[] = medicationSuggestions
      .filter(suggestion => suggestion.toLowerCase().includes(searchLower))
      .slice(0, SEARCH_LIMITS.MEDICATION_SUGGESTIONS)
      .map(text => ({ text, type: 'medication' }));

    const indSuggestions: SearchSuggestion[] = indicationSuggestions
      .filter(suggestion => suggestion.text.toLowerCase().includes(searchLower))
      .slice(0, SEARCH_LIMITS.INDICATION_SUGGESTIONS)
      .map(suggestion => ({ 
        text: suggestion.text, 
        type: 'indication',
        medicationId: suggestion.medicationId 
      }));

    return [...medSuggestions, ...indSuggestions].slice(0, SEARCH_LIMITS.TOTAL_SUGGESTIONS);
  },

  isVoiceSearchSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  },

  startVoiceRecognition(onResult: (transcript: string) => void): void {
    if (!this.isVoiceSearchSupported()) return;

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    
    recognition.start();
  },
};
