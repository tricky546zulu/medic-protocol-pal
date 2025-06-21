
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { MedicationCard } from '@/components/medications/MedicationCard';
import { MedicationSearch } from '@/components/medications/MedicationSearch';
import { MedicationFilters } from '@/components/medications/MedicationFilters';
import { EmergencyCategories } from '@/components/medications/EmergencyCategories';
import type { Database } from '@/integrations/supabase/types';

type Medication = Database['public']['Tables']['medications']['Row'];

const Medications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    patientType: 'all',
    classification: 'all',
    highAlert: false,
    route: 'all',
  });

  const { data: medications, isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('medication_name');

      if (error) throw error;
      return data;
    },
  });

  // Get dosing data for filtering by patient type and route
  const { data: dosingData } = useQuery({
    queryKey: ['all-dosing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medication_dosing')
        .select('medication_id, patient_type, route');
      
      if (error) throw error;
      return data;
    },
  });

  const medicationSuggestions = useMemo(() => {
    return medications?.map(med => med.medication_name) || [];
  }, [medications]);

  const filteredMedications = useMemo(() => {
    if (!medications) return [];

    let filtered = medications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(med =>
        med.medication_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // High alert filter
    if (filters.highAlert) {
      filtered = filtered.filter(med => med.high_alert);
    }

    // Classification filter
    if (filters.classification !== 'all') {
      filtered = filtered.filter(med =>
        med.classification?.some(cls => 
          cls.toLowerCase().includes(filters.classification.toLowerCase())
        )
      );
    }

    // Patient type and route filters (requires dosing data)
    if (dosingData && (filters.patientType !== 'all' || filters.route !== 'all')) {
      const medicationIds = new Set();
      
      dosingData.forEach(dosing => {
        const matchesPatientType = filters.patientType === 'all' || dosing.patient_type === filters.patientType;
        const matchesRoute = filters.route === 'all' || dosing.route === filters.route;
        
        if (matchesPatientType && matchesRoute) {
          medicationIds.add(dosing.medication_id);
        }
      });

      filtered = filtered.filter(med => medicationIds.has(med.id));
    }

    return filtered;
  }, [medications, searchTerm, filters, dosingData]);

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      patientType: 'all',
      classification: 'all',
      highAlert: false,
      route: 'all',
    });
    setSearchTerm('');
  };

  const handleCategorySelect = (categoryId: string) => {
    switch (categoryId) {
      case 'cardiac-arrest':
        setSearchTerm('');
        setFilters(prev => ({ ...prev, classification: 'Cardiac' }));
        break;
      case 'respiratory':
        setSearchTerm('');
        setFilters(prev => ({ ...prev, classification: 'Respiratory' }));
        break;
      case 'seizure':
        setSearchTerm('');
        setFilters(prev => ({ ...prev, classification: 'Anticonvulsant' }));
        break;
      case 'arrhythmia':
        setSearchTerm('');
        setFilters(prev => ({ ...prev, classification: 'Antiarrhythmic' }));
        break;
      case 'pediatric':
        setSearchTerm('');
        setFilters(prev => ({ ...prev, patientType: 'Pediatric' }));
        break;
      case 'high-alert':
        setSearchTerm('');
        setFilters(prev => ({ ...prev, highAlert: true }));
        break;
    }
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== 'all' && value !== false
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Saskatchewan EMS Medications
        </h1>
        <p className="text-gray-600 mb-6">
          Provincial medication protocols and dosing guidelines for emergency medical services
        </p>
        
        <div className="max-w-2xl mb-6">
          <MedicationSearch
            value={searchTerm}
            onChange={setSearchTerm}
            suggestions={medicationSuggestions}
            isLoading={isLoading}
          />
        </div>
      </div>

      <EmergencyCategories onCategorySelect={handleCategorySelect} />

      <MedicationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredMedications.length} medication{filteredMedications.length !== 1 ? 's' : ''}
            {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} applied)`}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedications?.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))}
          </div>
        </>
      )}

      {filteredMedications && filteredMedications.length === 0 && !isLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500 mb-4">No medications found matching your criteria.</p>
            {(searchTerm || activeFiltersCount > 0) && (
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Clear all filters and search
              </button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Medications;
