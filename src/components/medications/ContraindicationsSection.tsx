
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertOctagonIcon } from 'lucide-react'; // Changed icon to AlertOctagonIcon for stronger warning
import type { Database } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';

type Contraindication = Database['public']['Tables']['medication_contraindications']['Row'];

interface ContraindicationsSectionProps {
  contraindications: Contraindication[];
}

export const ContraindicationsSection = ({ contraindications }: ContraindicationsSectionProps) => {
  if (!contraindications || contraindications.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 sm:mb-8 bg-destructive/5 border-destructive/20 shadow-md"> {/* Themed background and border, consistent margin */}
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 text-destructive text-base sm:text-lg font-semibold"> {/* Responsive text size */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-destructive/10 rounded-md flex items-center justify-center"> {/* Responsive icon container */}
            <AlertOctagonIcon className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" /> {/* Responsive icon size */}
          </div>
          Contraindications & Precautions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 sm:space-y-4"> {/* Responsive spacing */}
          {contraindications.map((item) => ( // Renamed contraindication to item for clarity
            <li
              key={item.id}
              className="bg-card p-3 sm:p-4 border border-destructive/15 rounded-md shadow-sm" // Use card bg, themed border
            >
              <p className="text-sm text-destructive-foreground/90 leading-relaxed"> {/* Use themed text color */}
                {item.contraindication}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
