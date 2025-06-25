
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, CheckCircle, Edit2, Save, X } from 'lucide-react';
import type { MedicationWizardData } from '../wizard/types';
import type { PDFExtractionResult } from './PDFProcessor';

interface PDFPreviewProps {
  file: File;
  extractionResult: PDFExtractionResult;
  medications: MedicationWizardData[];
  onMedicationsChange: (medications: MedicationWizardData[]) => void;
}

export const PDFPreview = ({ 
  file, 
  extractionResult, 
  medications, 
  onMedicationsChange 
}: PDFPreviewProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<MedicationWizardData | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditData(medications[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editData) {
      const updatedMedications = [...medications];
      updatedMedications[editingIndex] = editData;
      onMedicationsChange(updatedMedications);
      setEditingIndex(null);
      setEditData(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditData(null);
  };

  const removeMedication = (index: number) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    onMedicationsChange(updatedMedications);
  };

  return (
    <div className="space-y-6">
      {/* Extraction Summary */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            PDF Processing Complete
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline">{file.name}</Badge>
            <span className="text-gray-600">
              {extractionResult.extractedCount} medications extracted
            </span>
            <Badge variant="secondary">
              {Math.round((extractionResult.confidence || 0) * 100)}% confidence
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Medications List with Editing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Extracted Medications - Review & Correct</h3>
        
        {medications.map((medication, index) => (
          <Card key={index} className="border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-3">
                <h4 className="font-medium text-lg">
                  {editingIndex === index ? (
                    <Input
                      value={editData?.basic.medication_name || ''}
                      onChange={(e) => setEditData(prev => prev ? {
                        ...prev,
                        basic: { ...prev.basic, medication_name: e.target.value }
                      } : null)}
                      className="text-lg font-medium"
                    />
                  ) : (
                    medication.basic.medication_name
                  )}
                </h4>
                {medication.basic.high_alert && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    High Alert
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {editingIndex === index ? (
                  <>
                    <Button onClick={saveEdit} size="sm" variant="default">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button onClick={cancelEdit} size="sm" variant="outline">
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => handleEdit(index)} size="sm" variant="outline">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => removeMedication(index)} 
                      size="sm" 
                      variant="destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Classification */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Classification</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {medication.basic.classification.map((cls, i) => (
                      <Badge key={i} variant="outline">{cls}</Badge>
                    ))}
                  </div>
                </div>

                {/* Indications Count */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Indications</label>
                  <Badge variant="secondary" className="mt-1">
                    {medication.indications.length} indications
                  </Badge>
                </div>

                {/* Dosing Protocols Count */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Dosing Protocols</label>
                  <Badge variant="secondary" className="mt-1">
                    {medication.dosing.length} protocols
                  </Badge>
                </div>

                {/* Quick Dose Preview */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Sample Dose</label>
                  <div className="text-sm text-gray-600 mt-1">
                    {medication.dosing[0]?.dose || 'No dosing info'}
                  </div>
                </div>
              </div>

              {/* Edit Form (when editing) */}
              {editingIndex === index && editData && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div>
                    <label className="text-sm font-medium">Quick Notes/Corrections</label>
                    <Textarea
                      placeholder="Add any corrections or notes about this medication..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {medications.length === 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <span>No medications were extracted from this PDF. You may need to try a different page or file.</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
