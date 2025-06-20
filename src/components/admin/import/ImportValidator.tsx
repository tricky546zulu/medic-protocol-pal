
import type { MedicationWizardData } from '../wizard/types';

interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export class ImportValidator {
  validateBulkData(rawData: any[]): { validData: MedicationWizardData[], validationResults: ValidationResult[] } {
    const validData: MedicationWizardData[] = [];
    const validationResults: ValidationResult[] = [];

    rawData.forEach((item, index) => {
      const result = this.validateSingleMedication(item, index);
      validationResults.push(result);

      if (result.errors.length === 0) {
        const medicationData = this.transformToMedicationData(item);
        if (medicationData) {
          validData.push(medicationData);
        }
      }
    });

    return { validData, validationResults };
  }

  private validateSingleMedication(item: any, rowIndex: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (!item.medication_name || item.medication_name.trim() === '') {
      errors.push('Medication name is required');
    }

    // Check for at least one indication
    const hasIndication = this.hasValidIndication(item);
    if (!hasIndication) {
      errors.push('At least one indication is required');
    }

    // Check for at least one dosing protocol
    const hasDosing = this.hasValidDosing(item);
    if (!hasDosing) {
      errors.push('At least one dosing protocol is required');
    }

    // Validate patient types
    if (item.patient_type_1 && !this.isValidPatientType(item.patient_type_1)) {
      warnings.push(`Invalid patient type: ${item.patient_type_1}`);
    }

    // Validate boolean fields
    if (item.high_alert !== undefined && !this.isValidBoolean(item.high_alert)) {
      warnings.push('high_alert should be true/false');
    }

    // Check for potential duplicates (basic check)
    if (item.medication_name && item.medication_name.length < 2) {
      warnings.push('Medication name seems too short');
    }

    return { errors, warnings };
  }

  private hasValidIndication(item: any): boolean {
    // Check for indication pairs (type + text)
    for (let i = 1; i <= 10; i++) {
      const typeField = `indication_type_${i}`;
      const textField = `indication_text_${i}`;
      
      if (item[typeField] && item[textField]) {
        return true;
      }
    }

    // Check for JSON format indications
    if (item.indications && Array.isArray(item.indications) && item.indications.length > 0) {
      return item.indications.some((ind: any) => ind.indication_type && ind.indication_text);
    }

    return false;
  }

  private hasValidDosing(item: any): boolean {
    // Check for dosing fields
    for (let i = 1; i <= 10; i++) {
      const patientField = `patient_type_${i}`;
      const doseField = `dose_${i}`;
      
      if (item[patientField] && item[doseField]) {
        return true;
      }
    }

    // Check for JSON format dosing
    if (item.dosing && Array.isArray(item.dosing) && item.dosing.length > 0) {
      return item.dosing.some((dose: any) => dose.patient_type && dose.dose);
    }

    return false;
  }

  private isValidPatientType(patientType: string): boolean {
    const validTypes = ['Adult', 'Pediatric', 'Neonatal', 'Geriatric', 'All Ages'];
    return validTypes.includes(patientType);
  }

  private isValidBoolean(value: any): boolean {
    return value === true || value === false || value === 'true' || value === 'false' || value === '1' || value === '0';
  }

  private transformToMedicationData(item: any): MedicationWizardData | null {
    try {
      // Handle JSON format
      if (item.basic && item.indications && item.dosing) {
        return item as MedicationWizardData;
      }

      // Transform CSV format
      const medicationData: MedicationWizardData = {
        basic: {
          medication_name: item.medication_name || '',
          classification: this.parseArrayField(item.classification) || [],
          high_alert: this.parseBoolean(item.high_alert) || false
        },
        indications: this.parseIndications(item),
        contraindications: this.parseContraindications(item),
        dosing: this.parseDosing(item),
        administration: {
          preparation: this.parseArrayField(item.preparation) || [],
          administration_notes: this.parseArrayField(item.administration_notes) || [],
          monitoring: this.parseArrayField(item.monitoring) || [],
          adverse_effects: this.parseArrayField(item.adverse_effects) || []
        }
      };

      return medicationData;
    } catch (error) {
      console.error('Error transforming medication data:', error);
      return null;
    }
  }

  private parseArrayField(value: any): string[] {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value.split(';').map(v => v.trim()).filter(v => v);
    }
    return [];
  }

  private parseBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return false;
  }

  private parseIndications(item: any) {
    const indications = [];
    
    for (let i = 1; i <= 10; i++) {
      const type = item[`indication_type_${i}`];
      const text = item[`indication_text_${i}`];
      
      if (type && text) {
        indications.push({
          indication_type: type,
          indication_text: text
        });
      }
    }
    
    return indications;
  }

  private parseContraindications(item: any): string[] {
    const contraindications = [];
    
    for (let i = 1; i <= 10; i++) {
      const contraindication = item[`contraindication_${i}`];
      if (contraindication) {
        contraindications.push(contraindication);
      }
    }
    
    return contraindications;
  }

  private parseDosing(item: any) {
    const dosing = [];
    
    for (let i = 1; i <= 10; i++) {
      const patientType = item[`patient_type_${i}`];
      const dose = item[`dose_${i}`];
      const indication = item[`indication_${i}`];
      const route = item[`route_${i}`];
      
      if (patientType && dose) {
        dosing.push({
          patient_type: patientType,
          indication: indication || 'General',
          dose: dose,
          route: route,
          provider_routes: this.parseArrayField(item[`provider_routes_${i}`]),
          concentration_supplied: item[`concentration_supplied_${i}`],
          compatibility_stability: this.parseArrayField(item[`compatibility_stability_${i}`]),
          notes: this.parseArrayField(item[`notes_${i}`])
        });
      }
    }
    
    return dosing;
  }
}
