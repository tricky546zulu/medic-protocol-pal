
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Stethoscope, Brain, Baby, Clock } from 'lucide-react';

interface EmergencyCategoriesProps {
  onCategorySelect: (category: string) => void;
}

const EMERGENCY_CATEGORIES = [
  {
    id: 'cardiac-arrest',
    name: 'Cardiac Arrest',
    icon: Heart,
    color: 'bg-red-100 text-red-800 border-red-200',
    keywords: ['Epinephrine', 'Amiodarone', 'Atropine'],
  },
  {
    id: 'respiratory',
    name: 'Respiratory Emergency',
    icon: Stethoscope,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    keywords: ['Salbutamol', 'Epinephrine', 'Dexamethasone'],
  },
  {
    id: 'seizure',
    name: 'Seizure/Neurological',
    icon: Brain,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    keywords: ['Midazolam', 'Diazepam', 'Lorazepam'],
  },
  {
    id: 'arrhythmia',
    name: 'Arrhythmia',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    keywords: ['Amiodarone', 'Adenosine', 'Lidocaine'],
  },
  {
    id: 'pediatric',
    name: 'Pediatric Emergency',
    icon: Baby,
    color: 'bg-green-100 text-green-800 border-green-200',
    keywords: ['Pediatric'],
  },
  {
    id: 'high-alert',
    name: 'High Alert Medications',
    icon: Clock,
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    keywords: ['High Alert'],
  },
];

export const EmergencyCategories = ({ onCategorySelect }: EmergencyCategoriesProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Access - Emergency Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {EMERGENCY_CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-md transition-shadow border-2"
              onClick={() => onCategorySelect(category.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${category.color}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">{category.name}</h4>
                <div className="flex flex-wrap gap-1 justify-center">
                  {category.keywords.slice(0, 2).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
