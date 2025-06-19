
-- Create medications table (main entity)
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_name TEXT NOT NULL UNIQUE,
  classification TEXT[],
  high_alert BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indications table
CREATE TABLE public.medication_indications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE,
  indication_type TEXT NOT NULL, -- "EMS INDICATIONS", "HEALTH CANADA APPROVED", etc.
  indication_text TEXT NOT NULL
);

-- Create contraindications table  
CREATE TABLE public.medication_contraindications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE,
  contraindication TEXT NOT NULL
);

-- Create dosing table (handles complex dosing scenarios)
CREATE TABLE public.medication_dosing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE,
  indication TEXT NOT NULL,
  patient_type TEXT NOT NULL, -- "Adult", "Pediatric", "Neonatal", etc.
  dose TEXT NOT NULL,
  route TEXT,
  notes TEXT[],
  concentration_supplied TEXT,
  compatibility_stability TEXT[],
  provider_routes TEXT[]
);

-- Create administration details table
CREATE TABLE public.medication_administration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE,
  preparation TEXT[],
  administration_notes TEXT[],
  monitoring TEXT[],
  adverse_effects TEXT[]
);

-- Create indexes for better performance
CREATE INDEX idx_medications_name ON public.medications(medication_name);
CREATE INDEX idx_medications_classification ON public.medications USING GIN(classification);
CREATE INDEX idx_medications_high_alert ON public.medications(high_alert);
CREATE INDEX idx_medication_indications_med_id ON public.medication_indications(medication_id);
CREATE INDEX idx_medication_contraindications_med_id ON public.medication_contraindications(medication_id);
CREATE INDEX idx_medication_dosing_med_id ON public.medication_dosing(medication_id);
CREATE INDEX idx_medication_dosing_patient_type ON public.medication_dosing(patient_type);
CREATE INDEX idx_medication_administration_med_id ON public.medication_administration(medication_id);

-- Enable Row Level Security
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_indications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_contraindications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_dosing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_administration ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is educational/reference material)
CREATE POLICY "Allow public read access to medications" ON public.medications FOR SELECT USING (true);
CREATE POLICY "Allow public read access to indications" ON public.medication_indications FOR SELECT USING (true);
CREATE POLICY "Allow public read access to contraindications" ON public.medication_contraindications FOR SELECT USING (true);
CREATE POLICY "Allow public read access to dosing" ON public.medication_dosing FOR SELECT USING (true);
CREATE POLICY "Allow public read access to administration" ON public.medication_administration FOR SELECT USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_medications_updated_at 
    BEFORE UPDATE ON public.medications 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
