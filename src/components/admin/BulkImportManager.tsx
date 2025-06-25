
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUp, Download, FileText } from 'lucide-react';
import { ImportPreview } from './import/ImportPreview';
import { ImportTemplates } from './import/ImportTemplates';
import { ImportValidator } from './import/ImportValidator';
import { FileUploader } from './import/FileUploader';
import { ImportResults } from './import/ImportResults';
import { ImportProgress } from './import/ImportProgress';
import { CSVParser } from './import/CSVParser';
import { MedicationProcessor } from './import/MedicationProcessor';
import { PDFProcessor, PDFExtractionResult } from './import/PDFProcessor';
import { PDFPreview } from './import/PDFPreview';
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
  const [pdfExtractionResult, setPdfExtractionResult] = useState<PDFExtractionResult | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setIsProcessing(true);
    setImportProgress(0);
    setPdfExtractionResult(null);

    try {
      let parsedData: MedicationWizardData[] = [];

      if (file.name.toLowerCase().endsWith('.pdf')) {
        // Handle PDF extraction
        console.log('Processing PDF file...');
        const result = await PDFProcessor.extractMedicationsFromPDF(
          file, 
          1, 
          setImportProgress
        );
        
        setPdfExtractionResult(result);
        
        if (result.success) {
          parsedData = result.medications;
        } else {
          throw new Error(result.error || 'Failed to extract PDF data');
        }
      } else {
        // Handle CSV/JSON files (existing logic)
        const text = await file.text();
        let rawData: any[] = [];

        if (file.name.endsWith('.json')) {
          rawData = JSON.parse(text);
        } else if (file.name.endsWith('.csv')) {
          rawData = CSVParser.parseCSV(text);
        }

        const validator = new ImportValidator();
        const { validData } = validator.validateBulkData(rawData);
        parsedData = validData;
      }

      // Validate the parsed data
      const validator = new ImportValidator();
      const { validData, validationResults: results } = validator.validateBulkData(
        parsedData.map(med => ({
          basic: med.basic,
          indications: med.indications,
          contraindications: med.contraindications,
          dosing: med.dosing,
          administration: med.administration
        }))
      );
      
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
    setPdfExtractionResult(null);
  };

  const isPDFFile = importFile?.name.toLowerCase().endsWith('.pdf');

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
                  <Badge variant="outline" className="truncate max-w-32 sm:max-w-48 md:max-w-64 flex items-center gap-1">
                    {isPDFFile && <FileText className="h-3 w-3" />}
                    {importFile.name}
                  </Badge>
                  {isPDFFile && (
                    <Badge variant="secondary">AI Extracted</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <ImportProgress progress={importProgress} />
                ) : (
                  <>
                    {isPDFFile && pdfExtractionResult ? (
                      <PDFPreview
                        file={importFile}
                        extractionResult={pdfExtractionResult}
                        medications={importData}
                        onMedicationsChange={setImportData}
                      />
                    ) : (
                      <ImportPreview 
                        data={importData} 
                        validationResults={validationResults}
                        onDataChange={setImportData}
                      />
                    )}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                      <Button variant="outline" onClick={resetImport} className="order-2 sm:order-1">
                        Cancel
                      </Button>
                      <Button 
                        onClick={processImport} 
                        disabled={importData.length === 0}
                        className="order-1 sm:order-2"
                      >
                        Import {importData.length} Medications
                        {isPDFFile && <Badge variant="secondary" className="ml-2">From PDF</Badge>}
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
