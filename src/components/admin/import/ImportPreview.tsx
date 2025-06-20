
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertTriangle, CheckCircle, Edit } from 'lucide-react';
import type { MedicationWizardData } from '../wizard/types';

interface ImportPreviewProps {
  data: MedicationWizardData[];
  validationResults: any[];
  onDataChange: (data: MedicationWizardData[]) => void;
}

export const ImportPreview = ({ data, validationResults, onDataChange }: ImportPreviewProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<MedicationWizardData | null>(null);

  const getValidationStatus = (index: number) => {
    const result = validationResults[index];
    if (result?.errors?.length > 0) return 'error';
    if (result?.warnings?.length > 0) return 'warning';
    return 'success';
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditData(data[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editData) {
      const newData = [...data];
      newData[editingIndex] = editData;
      onDataChange(newData);
      setEditingIndex(null);
      setEditData(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No valid medication data found in the uploaded file.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Preview & Validation</h3>
        <Badge variant="outline">
          {data.length} medications found
        </Badge>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Medication Name</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead>High Alert</TableHead>
              <TableHead>Indications</TableHead>
              <TableHead>Dosing Protocols</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((medication, index) => {
              const status = getValidationStatus(index);
              const validationResult = validationResults[index];
              
              return (
                <TableRow key={index} className={status === 'error' ? 'bg-red-50' : status === 'warning' ? 'bg-yellow-50' : ''}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status)}
                      {validationResult?.errors?.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {validationResult.errors.length} errors
                        </Badge>
                      )}
                      {validationResult?.warnings?.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {validationResult.warnings.length} warnings
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {medication.basic.medication_name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {medication.basic.classification.map((cls, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {cls}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {medication.basic.high_alert ? (
                      <Badge variant="destructive">High Alert</Badge>
                    ) : (
                      <Badge variant="secondary">Standard</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {medication.indications.length} indications
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {medication.dosing.length} protocols
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(index)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[600px] max-w-[80vw]">
                        <SheetHeader>
                          <SheetTitle>Edit Medication Data</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="text-sm font-medium">Medication Name</label>
                            <Input
                              value={editData?.basic.medication_name || ''}
                              onChange={(e) => setEditData(prev => prev ? {
                                ...prev,
                                basic: { ...prev.basic, medication_name: e.target.value }
                              } : null)}
                            />
                          </div>
                          
                          {validationResult?.errors?.length > 0 && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                              <div className="text-sm font-medium text-red-800 mb-2">Validation Errors:</div>
                              {validationResult.errors.map((error: string, i: number) => (
                                <div key={i} className="text-sm text-red-600">{error}</div>
                              ))}
                            </div>
                          )}
                          
                          <Button onClick={saveEdit} className="w-full">
                            Save Changes
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
