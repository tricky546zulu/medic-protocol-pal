
-- Update the comment to document the expanded JSONB structure for infusion pump settings
COMMENT ON COLUMN public.medication_dosing.infusion_pump_settings IS 
'JSON object containing infusion pump settings: {
  "cca_setting": "string",
  "line_option": "A" | "B", 
  "duration": "string",
  "vtbi": "string",
  "pump_instructions": "string",
  "medication_selection": "string"
}';
