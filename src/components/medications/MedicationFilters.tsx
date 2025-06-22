
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';

interface MedicationFiltersProps {
  filters: {
    patientType: string;
    classification: string;
    route: string;
  };
  onStringFilterChange: (key: 'patientType' | 'classification' | 'route', value: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

const PATIENT_TYPES = [
  { value: 'all', label: 'All Patient Types' },
  { value: 'Adult', label: 'Adult' },
  { value: 'Pediatric', label: 'Pediatric' },
  { value: 'Neonatal', label: 'Neonatal' },
  { value: 'Geriatric', label: 'Geriatric' },
];

const CLASSIFICATIONS = [
  { value: 'all', label: 'All Classifications' },
  { value: 'Analgesic', label: 'Analgesics' },
  { value: 'Cardiac', label: 'Cardiac' },
  { value: 'Respiratory', label: 'Respiratory' },
  { value: 'Sedative', label: 'Sedatives' },
  { value: 'Anticonvulsant', label: 'Anticonvulsants' },
  { value: 'Antiarrhythmic', label: 'Antiarrhythmics' },
  { value: 'Vasopressor', label: 'Vasopressors' },
  { value: 'Electrolyte', label: 'Electrolytes' },
];

const ROUTES = [
  { value: 'all', label: 'All Routes' },
  { value: 'IV', label: 'Intravenous (IV)' },
  { value: 'IM', label: 'Intramuscular (IM)' },
  { value: 'SL', label: 'Sublingual (SL)' },
  { value: 'PO', label: 'Oral (PO)' },
  { value: 'Inhalation', label: 'Inhalation' },
  { value: 'Topical', label: 'Topical' },
];

export const MedicationFilters = ({ 
  filters, 
  onStringFilterChange,
  onClearFilters, 
  activeFiltersCount 
}: MedicationFiltersProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-gray-100">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Advanced Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearFilters}
              className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Patient Type</label>
            <Select value={filters.patientType} onValueChange={(value) => onStringFilterChange('patientType', value)}>
              <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-primary/20 transition-all duration-200">
                <SelectValue placeholder="Select patient type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-xl">
                {PATIENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="hover:bg-gray-50">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Classification</label>
            <Select value={filters.classification} onValueChange={(value) => onStringFilterChange('classification', value)}>
              <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-primary/20 transition-all duration-200">
                <SelectValue placeholder="Select classification" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-xl">
                {CLASSIFICATIONS.map((cls) => (
                  <SelectItem key={cls.value} value={cls.value} className="hover:bg-gray-50">
                    {cls.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Route</label>
            <Select value={filters.route} onValueChange={(value) => onStringFilterChange('route', value)}>
              <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-primary/20 transition-all duration-200">
                <SelectValue placeholder="Select route" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-xl">
                {ROUTES.map((route) => (
                  <SelectItem key={route.value} value={route.value} className="hover:bg-gray-50">
                    {route.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
