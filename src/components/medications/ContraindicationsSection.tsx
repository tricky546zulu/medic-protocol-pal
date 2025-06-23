
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileWarning } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Contraindication = Database['public']['Tables']['medication_contraindications']['Row'];

interface ContraindicationsSectionProps {
  contraindications: Contraindication[];
}

export const ContraindicationsSection = ({ contraindications }: ContraindicationsSectionProps) => {
  if (!contraindications || contraindications.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 bg-gradient-to-br from-red-50 to-rose-100 border border-red-200/50 rounded-lg shadow-lg">
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-4 text-red-800 text-lg font-bold">
          <div className="p-3 bg-red-100 rounded-lg border border-red-200/60 shadow-lg">
            <FileWarning className="h-5 w-5" />
          </div>
          ⚠️ Contraindications & Precautions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {contraindications.map((contraindication) => (
            <div key={contraindication.id} className="bg-white p-4 rounded-lg border border-red-100/70 hover:bg-white/95 hover:shadow-md transition-all duration-200 shadow-lg">
              <p className="text-sm text-red-800 font-medium break-words leading-relaxed">
                • {contraindication.contraindication}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
