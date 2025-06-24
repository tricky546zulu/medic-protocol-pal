
export interface MedicationBasic {
  medication_name: string;
  classification: string[];
  high_alert: boolean;
  infusion_only?: boolean;
}

export interface MedicationIndication {
  indication_text: string;
  indication_type: string;
}

export interface MedicationDosing {
  patient_type: string;
  indication: string;
  dose: string;
  route?: string;
  provider_routes?: string[];
  concentration_supplied?: string;
  compatibility_stability?: string[];
  notes?: string[];
  requires_infusion_pump: boolean;
  infusion_pump_settings?: {
    medication_selection?: string;
    cca_setting?: string;
    line_option?: string;
    duration?: string;
    vtbi?: string;
    pump_instructions?: string;
  };
}

export interface MedicationAdministration {
  preparation?: string[];
  administration_notes?: string[];
  monitoring?: string[];
  adverse_effects?: string[];
}

export interface MedicationWizardData {
  basic: MedicationBasic;
  indications: MedicationIndication[];
  contraindications: string[];
  dosing: MedicationDosing[];
  administration: MedicationAdministration;
}

export interface WizardStepProps {
  data: MedicationWizardData;
  updateData: <K extends keyof MedicationWizardData>(stepKey: K, data: MedicationWizardData[K]) => void;
}

export interface EditMedicationProps {
  medicationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
