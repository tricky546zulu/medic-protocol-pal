
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertTriangle, X } from 'lucide-react';

interface MedicationFiltersProps {
  filters: {
    patientType: string;
    classification: string;
    highAlert: boolean;
    route: string;
  };
  onFilterChange: (key: string, value: string | boolean) => void;
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
  onFilterChange, 
  onClearFilters, 
  activeFiltersCount 
}: MedicationFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filter Medications</CardTitle>
          {activeFiltersCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters ({activeFiltersCount})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Patient Type</Label>
            <Select value={filters.patientType} onValueChange={(value) => onFilterChange('patientType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select patient type" />
              </SelectTrigger>
              <SelectContent>
                {PATIENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Classification</Label>
            <Select value={filters.classification} onValueChange={(value) => onFilterChange('classification', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select classification" />
              </SelectTrigger>
              <SelectContent>
                {CLASSIFICATIONS.map((cls) => (
                  <SelectItem key={cls.value} value={cls.value}>
                    {cls.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Route</Label>
            <Select value={filters.route} onValueChange={(value) => onFilterChange('route', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select route" />
              </SelectTrigger>
              <SelectContent>
                {ROUTES.map((route) => (
                  <SelectItem key={route.value} value={route.value}>
                    {route.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Switch
              id="high-alert"
              checked={filters.highAlert}
              onCheckedChange={(checked) => onFilterChange('highAlert', checked)}
            />
            <Label htmlFor="high-alert" className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              High Alert Only
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
