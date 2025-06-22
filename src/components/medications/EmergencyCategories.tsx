
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
    color: 'bg-gradient-to-br from-red-50 to-red-100 text-red-700 border-red-200',
    hoverColor: 'hover:from-red-100 hover:to-red-200',
    keywords: ['Epinephrine', 'Amiodarone'],
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: Stethoscope,
    color: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-blue-200',
    hoverColor: 'hover:from-blue-100 hover:to-blue-200',
    keywords: ['Salbutamol', 'Dexamethasone'],
  },
  {
    id: 'seizure',
    name: 'Neurological',
    icon: Brain,
    color: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 border-purple-200',
    hoverColor: 'hover:from-purple-100 hover:to-purple-200',
    keywords: ['Midazolam', 'Diazepam'],
  },
  {
    id: 'arrhythmia',
    name: 'Arrhythmia',
    icon: Zap,
    color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-200',
    hoverColor: 'hover:from-yellow-100 hover:to-yellow-200',
    keywords: ['Amiodarone', 'Adenosine'],
  },
  {
    id: 'pediatric',
    name: 'Pediatric',
    icon: Baby,
    color: 'bg-gradient-to-br from-green-50 to-green-100 text-green-700 border-green-200',
    hoverColor: 'hover:from-green-100 hover:to-green-200',
    keywords: ['Pediatric Dosing'],
  },
  {
    id: 'high-alert',
    name: 'High Alert',
    icon: Clock,
    color: 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 border-orange-200',
    hoverColor: 'hover:from-orange-100 hover:to-orange-200',
    keywords: ['Critical Care'],
  },
];

export const EmergencyCategories = ({ onCategorySelect }: EmergencyCategoriesProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-6 text-gray-900">Emergency Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {EMERGENCY_CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card
              key={category.id}
              className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${category.hoverColor} group bg-white/80 backdrop-blur-sm`}
              onClick={() => onCategorySelect(category.id)}
            >
              <CardContent className="p-5 text-center">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 ${category.color}`}>
                  <IconComponent className="h-7 w-7" />
                </div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3 leading-tight">{category.name}</h4>
                <div className="flex flex-wrap gap-1 justify-center">
                  {category.keywords.slice(0, 2).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700 border-0">
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
