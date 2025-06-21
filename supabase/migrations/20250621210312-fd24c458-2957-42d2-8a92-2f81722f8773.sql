
-- Add RLS policies for medications table to allow authenticated users to perform CRUD operations

-- Allow authenticated users to insert medications
CREATE POLICY "Allow authenticated insert to medications" 
ON public.medications 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users to update medications
CREATE POLICY "Allow authenticated update to medications" 
ON public.medications 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Allow authenticated users to delete medications
CREATE POLICY "Allow authenticated delete to medications" 
ON public.medications 
FOR DELETE 
TO authenticated 
USING (true);

-- Add similar policies for related tables

-- medication_indications policies
CREATE POLICY "Allow authenticated insert to medication_indications" 
ON public.medication_indications 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update to medication_indications" 
ON public.medication_indications 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete to medication_indications" 
ON public.medication_indications 
FOR DELETE 
TO authenticated 
USING (true);

-- medication_contraindications policies
CREATE POLICY "Allow authenticated insert to medication_contraindications" 
ON public.medication_contraindications 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update to medication_contraindications" 
ON public.medication_contraindications 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete to medication_contraindications" 
ON public.medication_contraindications 
FOR DELETE 
TO authenticated 
USING (true);

-- medication_dosing policies
CREATE POLICY "Allow authenticated insert to medication_dosing" 
ON public.medication_dosing 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update to medication_dosing" 
ON public.medication_dosing 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete to medication_dosing" 
ON public.medication_dosing 
FOR DELETE 
TO authenticated 
USING (true);

-- medication_administration policies
CREATE POLICY "Allow authenticated insert to medication_administration" 
ON public.medication_administration 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update to medication_administration" 
ON public.medication_administration 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete to medication_administration" 
ON public.medication_administration 
FOR DELETE 
TO authenticated 
USING (true);
