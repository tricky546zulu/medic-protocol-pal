
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUp, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { ImportPreview } from './import/ImportPreview';
import { ImportTemplates } from './import/ImportTemplates';
import { ImportValidator } from './import/ImportValidator';
import type { MedicationWizardData } from './wizard/types';

interface ImportResult {
  success: boolean;
  processed: number;
  errors: string[];
  warnings: string[];
}

export const BulkImportManager = () => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<MedicationWizardData[]>([]);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'templates'>('upload');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setIsProcessing(true);

    try {
      const text = await file.text();
      let parsedData: any[] = [];

      if (file.name.endsWith('.json')) {
        parsedData = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        parsedData = parseCSV(text);
      }

      const validator = new ImportValidator();
      const { validData, validationResults: results } = validator.validateBulkData(parsedData);
      
      setImportData(validData);
      setValidationResults(results);
    } catch (error) {
      console.error('Error parsing file:', error);
      setValidationResults([{ error: `Failed to parse file: ${error}` }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const obj: any = {};
        
        headers.forEach((header, index) => {
          let value: any = values[index] || '';
          
          // Handle array fields - convert string to array
          if (header.includes('classification') || header.includes('preparation') || 
              header.includes('administration_notes') || header.includes('monitoring') || 
              header.includes('adverse_effects') || header.includes('notes') ||
              header.includes('compatibility_stability') || header.includes('provider_routes')) {
            obj[header] = value ? value.split(';').map((v: string) => v.trim()) : [];
          }
          // Handle boolean fields - convert string to boolean
          else if (header === 'high_alert') {
            obj[header] = value.toLowerCase() === 'true' || value === '1';
          }
          // Handle regular string fields
          else {
            obj[header] = value;
          }
        });
        
        return obj;
      });
  };

  const processImport = async () => {
    setIsProcessing(true);
    setImportProgress(0);
    
    const errors: string[] = [];
    const warnings: string[] = [];
    let processed = 0;

    try {
      for (let i = 0; i < importData.length; i++) {
        const medication = importData[i];
        
        try {
          // Process each medication (similar to ReviewStep logic)
          await processMedication(medication);
          processed++;
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error}`);
        }
        
        setImportProgress(((i + 1) / importData.length) * 100);
      }

      setImportResult({
        success: errors.length === 0,
        processed,
        errors,
        warnings
      });
    } catch (error) {
      setImportResult({
        success: false,
        processed,
        errors: [`Import failed: ${error}`],
        warnings
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processMedication = async (medicationData: MedicationWizardData) => {
    // This would contain the actual database insertion logic
    // For now, just simulate processing
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Processing medication:', medicationData.basic.medication_name);
  };

  const resetImport = () => {
    setImportFile(null);
    setImportData([]);
    setValidationResults([]);
    setImportResult(null);
    setImportProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Button
          variant={activeTab === 'upload' ? 'default' : 'outline'}
          onClick={() => setActiveTab('upload')}
        >
          <FileUp className="h-4 w-4 mr-2" />
          Upload & Import
        </Button>
        <Button
          variant={activeTab === 'templates' ? 'default' : 'outline'}
          onClick={() => setActiveTab('templates')}
        >
          <Download className="h-4 w-4 mr-2" />
          Templates & Examples
        </Button>
      </div>

      {activeTab === 'templates' && <ImportTemplates />}

      {activeTab === 'upload' && (
        <div className="space-y-6">
          {!importFile && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Medication Data</CardTitle>
                <p className="text-sm text-gray-600">
                  Upload a CSV or JSON file containing medication data. Use our templates for the correct format.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload">Select File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.json"
                      onChange={handleFileUpload}
                      className="mt-1"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    Supported formats: CSV, JSON
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {importFile && !importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Import Preview
                  <Badge variant="outline">{importFile.name}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <Progress value={importProgress} className="flex-1" />
                    <span className="text-sm text-gray-600">{Math.round(importProgress)}%</span>
                  </div>
                ) : (
                  <>
                    <ImportPreview 
                      data={importData} 
                      validationResults={validationResults}
                      onDataChange={setImportData}
                    />
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" onClick={resetImport}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={processImport} 
                        disabled={importData.length === 0}
                      >
                        Import {importData.length} Medications
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {importResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  Import Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{importResult.processed}</div>
                      <div className="text-sm text-gray-600">Processed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{importResult.errors.length}</div>
                      <div className="text-sm text-gray-600">Errors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{importResult.warnings.length}</div>
                      <div className="text-sm text-gray-600">Warnings</div>
                    </div>
                  </div>

                  {importResult.errors.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <div className="font-semibold">Import Errors:</div>
                          {importResult.errors.map((error, index) => (
                            <div key={index} className="text-sm">{error}</div>
                          ))}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button onClick={resetImport} className="w-full">
                    Start New Import
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
