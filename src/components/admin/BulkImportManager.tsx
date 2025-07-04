
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUp, Download } from 'lucide-react';
import { ImportPreview } from './import/ImportPreview';
import { ImportTemplates } from './import/ImportTemplates';
import { ImportValidator } from './import/ImportValidator';
import { FileUploader } from './import/FileUploader';
import { ImportResults } from './import/ImportResults';
import { ImportProgress } from './import/ImportProgress';
import { CSVParser } from './import/CSVParser';
import { MedicationProcessor } from './import/MedicationProcessor';
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
        parsedData = CSVParser.parseCSV(text);
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

  const processImport = async () => {
    setIsProcessing(true);
    setImportProgress(0);
    
    const result = await MedicationProcessor.processImportBatch(
      importData,
      setImportProgress
    );
    
    setImportResult(result);
    setIsProcessing(false);
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
      <div className="flex flex-col xs:flex-row gap-2">
        <Button
          variant={activeTab === 'upload' ? 'default' : 'outline'}
          onClick={() => setActiveTab('upload')}
          className="flex items-center gap-2 text-sm"
        >
          <FileUp className="h-4 w-4" />
          <span className="hidden xs:inline">Upload & Import</span>
          <span className="xs:hidden">Upload</span>
        </Button>
        <Button
          variant={activeTab === 'templates' ? 'default' : 'outline'}
          onClick={() => setActiveTab('templates')}
          className="flex items-center gap-2 text-sm"
        >
          <Download className="h-4 w-4" />
          <span className="hidden xs:inline">Templates & Examples</span>
          <span className="xs:hidden">Templates</span>
        </Button>
      </div>

      {activeTab === 'templates' && <ImportTemplates />}

      {activeTab === 'upload' && (
        <div className="space-y-6">
          {!importFile && <FileUploader onFileUpload={handleFileUpload} />}

          {importFile && !importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="shrink-0">Import Preview</span>
                  <Badge variant="outline" className="truncate max-w-32 sm:max-w-48 md:max-w-64">
                    {importFile.name}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <ImportProgress progress={importProgress} />
                ) : (
                  <>
                    <ImportPreview 
                      data={importData} 
                      validationResults={validationResults}
                      onDataChange={setImportData}
                    />
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
                      <Button variant="outline" onClick={resetImport} className="order-2 sm:order-1">
                        Cancel
                      </Button>
                      <Button 
                        onClick={processImport} 
                        disabled={importData.length === 0}
                        className="order-1 sm:order-2"
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
            <ImportResults importResult={importResult} onReset={resetImport} />
          )}
        </div>
      )}
    </div>
  );
};
