
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MedicationEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const MedicationEmptyState = ({
  hasActiveFilters,
  onClearFilters,
}: MedicationEmptyStateProps) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <p className="text-gray-500 mb-4">No medications found matching your criteria.</p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-blue-600 hover:text-blue-800 underline touch-manipulation"
          >
            Clear all filters and search
          </button>
        )}
      </CardContent>
    </Card>
  );
};
