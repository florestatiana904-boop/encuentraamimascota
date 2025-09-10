-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles 
  FOR DELETE USING (auth.uid() = id);

-- Create pets table for pet listings
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('perro', 'gato', 'otro')),
  breed TEXT,
  color TEXT,
  size TEXT CHECK (size IN ('pequeño', 'mediano', 'grande')),
  age_range TEXT CHECK (age_range IN ('cachorro', 'joven', 'adulto', 'senior')),
  gender TEXT CHECK (gender IN ('macho', 'hembra', 'desconocido')),
  status TEXT NOT NULL CHECK (status IN ('perdido', 'encontrado')) DEFAULT 'perdido',
  description TEXT,
  last_seen_location TEXT,
  last_seen_date DATE,
  contact_phone TEXT,
  contact_email TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on pets
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Pets policies - allow users to view all active pets but only manage their own
CREATE POLICY "pets_select_all_active" ON public.pets 
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "pets_insert_own" ON public.pets 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pets_update_own" ON public.pets 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "pets_delete_own" ON public.pets 
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for pet photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pet-photos', 'pet-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for pet photos
CREATE POLICY "pet_photos_select_all" ON storage.objects 
  FOR SELECT USING (bucket_id = 'pet-photos');

CREATE POLICY "pet_photos_insert_authenticated" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'pet-photos' AND auth.role() = 'authenticated');

CREATE POLICY "pet_photos_update_own" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'pet-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "pet_photos_delete_own" ON storage.objects 
  FOR DELETE USING (bucket_id = 'pet-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
