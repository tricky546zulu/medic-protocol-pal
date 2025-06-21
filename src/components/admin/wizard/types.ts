
export interface BasicMedicationInfo {
  medication_name: string;
  classification: string[];
  high_alert: boolean;
}

export interface MedicationIndication {
  indication_type: string;
  indication_text: string;
}

export interface InfusionPumpSettings {
  cca_setting?: string;
  line_option?: 'A' | 'B';
  duration?: string;
  vtbi?: string;
  pump_instructions?: string;
  medication_selection?: string;
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
  requires_infusion_pump?: boolean;
  infusion_pump_settings?: InfusionPumpSettings;
}

export interface MedicationAdministration {
  preparation: string[];
  administration_notes: string[];
  monitoring: string[];
  adverse_effects: string[];
}

export interface MedicationWizardData {
  basic: BasicMedicationInfo;
  indications: MedicationIndication[];
  contraindications: string[];
  dosing: MedicationDosing[];
  administration: MedicationAdministration;
}

export interface WizardStepProps {
  data: MedicationWizardData;
  updateData: (stepKey: keyof MedicationWizardData, data: any) => void;
}

export interface EditMedicationProps {
  medicationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
