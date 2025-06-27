
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MedicationNotFoundProps {
  onBackClick: () => void;
  error?: string; // Added optional error prop
}

export const MedicationNotFound = ({ onBackClick, error }: MedicationNotFoundProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-violet-50 to-sky-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-blue-50/40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.1),transparent_50%)]"></div>
      
      <div className="relative container mx-auto px-4 py-8 text-center">
        <Card className="bg-white/85 backdrop-blur-lg border border-white/30 rounded-lg py-12 shadow-lg">
          <CardContent className="p-8">
            <p className="text-gray-700 mb-6 text-lg font-medium">
              {error || "Medication not found."}
            </p>
            <Button onClick={onBackClick} className="rounded-lg bg-violet-500 hover:bg-violet-600 shadow-lg transition-all duration-300">
              Back to Medications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
