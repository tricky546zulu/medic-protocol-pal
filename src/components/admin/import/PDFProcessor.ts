
import { supabase } from '@/integrations/supabase/client';
import type { MedicationWizardData } from '../wizard/types';

export interface PDFExtractionResult {
  success: boolean;
  medications: MedicationWizardData[];
  pageNumber: number;
  extractedCount: number;
  error?: string;
  confidence?: number;
}

export class PDFProcessor {
  static async extractMedicationsFromPDF(
    file: File,
    pageNumber: number = 1,
    onProgress?: (progress: number) => void
  ): Promise<PDFExtractionResult> {
    try {
      onProgress?.(10);
      
      // Convert PDF to base64
      const base64 = await this.fileToBase64(file);
      onProgress?.(30);

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('extract-pdf-medications', {
        body: {
          pdfBase64: base64.split(',')[1], // Remove data:application/pdf;base64, prefix
          pageNumber
        }
      });

      onProgress?.(90);

      if (error || !data.success) {
        throw new Error(data?.error || error?.message || 'Failed to extract PDF data');
      }

      onProgress?.(100);

      return {
        success: true,
        medications: data.medications,
        pageNumber: data.pageNumber,
        extractedCount: data.extractedCount,
        confidence: 0.8 // Default confidence score
      };

    } catch (error) {
      console.error('PDF processing error:', error);
      return {
        success: false,
        medications: [],
        pageNumber,
        extractedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        confidence: 0
      };
    }
  }

  static async processBatchPDF(
    file: File,
    totalPages: number,
    onProgress?: (overall: number, currentPage: number) => void
  ): Promise<PDFExtractionResult[]> {
    const results: PDFExtractionResult[] = [];
    
    for (let page = 1; page <= totalPages; page++) {
      const result = await this.extractMedicationsFromPDF(file, page);
      results.push(result);
      
      const overallProgress = (page / totalPages) * 100;
      onProgress?.(overallProgress, page);
    }

    return results;
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
