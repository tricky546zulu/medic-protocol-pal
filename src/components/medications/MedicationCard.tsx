
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Pill, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Medication = Database['public']['Tables']['medications']['Row'];

interface MedicationCardProps {
  medication: Medication;
}

const classificationColors = {
  'Analgesic': 'bg-green-100 text-green-800',
  'Antipyretic': 'bg-blue-100 text-blue-800',
  'Anti-inflammatory': 'bg-purple-100 text-purple-800',
  'Antihistamine': 'bg-orange-100 text-orange-800',
  'Bronchodilator': 'bg-teal-100 text-teal-800',
  'Vasopressor': 'bg-red-100 text-red-800',
  'Antiarrhythmic': 'bg-indigo-100 text-indigo-800',
  'Sedative': 'bg-gray-100 text-gray-800',
  'Antiemetic': 'bg-yellow-100 text-yellow-800',
  'Opioid': 'bg-rose-100 text-rose-800',
};

const getClassificationColor = (classification: string) => {
  return classificationColors[classification as keyof typeof classificationColors] || 'bg-gray-100 text-gray-700';
};

export const MedicationCard = ({ medication }: MedicationCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userFavorites, addFavorite, removeFavorite, isAddingFavorite, isRemovingFavorite } = useFavorites();

  const isBookmarked = userFavorites.includes(medication.id);
  const isLoading = isAddingFavorite || isRemovingFavorite;

  const handleCardClick = () => {
    navigate(`/medications/${medication.id}`);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark medications",
        variant: "destructive",
      });
      return;
    }

    if (isBookmarked) {
      removeFavorite({ medicationId: medication.id, medicationName: medication.medication_name });
    } else {
      addFavorite({ medicationId: medication.id, medicationName: medication.medication_name });
    }
  };

  return (
    <Card 
      className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group relative"
      onClick={handleCardClick}
    >
      {/* Top-right Bookmark */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmarkClick}
        disabled={isLoading}
        className="absolute top-3 right-3 h-8 w-8 p-0 hover:bg-blue-50 z-10"
      >
        {isBookmarked ? (
          <BookmarkCheck className="h-4 w-4 text-blue-600 fill-current" />
        ) : (
          <Bookmark className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
        )}
      </Button>

      <CardContent className="p-6 pr-12">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Pill className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            {/* Large, Bold Medication Name */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 break-words leading-tight group-hover:text-blue-600 transition-colors">
              {medication.medication_name}
            </h3>
            
            {/* High Alert Badge */}
            {medication.high_alert && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded-full text-xs text-red-700">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="font-medium">High Alert</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Colored Classification Pills */}
        {medication.classification && medication.classification.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {medication.classification.slice(0, 4).map((cls, index) => (
              <Badge 
                key={cls} 
                className={`text-xs px-3 py-1 rounded-full border-0 font-medium ${getClassificationColor(cls)}`}
              >
                {cls}
              </Badge>
            ))}
            {medication.classification.length > 4 && (
              <Badge className="text-xs px-3 py-1 rounded-full border-0 font-medium bg-gray-100 text-gray-600">
                +{medication.classification.length - 4} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
