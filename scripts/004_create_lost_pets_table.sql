-- Crear tabla lost_pets según especificaciones
CREATE TABLE IF NOT EXISTS lost_pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT,
  alt_text TEXT,
  description TEXT NOT NULL,
  zone TEXT NOT NULL,
  found_date TIMESTAMP WITH TIME ZONE NOT NULL,
  contact_method TEXT CHECK (contact_method IN ('whatsapp', 'gmail')) NOT NULL,
  contact_info TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE lost_pets ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer todos los reportes
CREATE POLICY "lost_pets_select_all" ON lost_pets
  FOR SELECT USING (true);

-- Política: Solo usuarios autenticados pueden insertar sus propios reportes
CREATE POLICY "lost_pets_insert_own" ON lost_pets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Solo el dueño puede actualizar sus reportes
CREATE POLICY "lost_pets_update_own" ON lost_pets
  FOR UPDATE USING (auth.uid() = user_id);

-- Política: Solo el dueño puede eliminar sus reportes
CREATE POLICY "lost_pets_delete_own" ON lost_pets
  FOR DELETE USING (auth.uid() = user_id);

-- Crear bucket para fotos de mascotas si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('pets_photos', 'pets_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage: todos pueden ver, solo autenticados pueden subir
CREATE POLICY "pets_photos_select_all" ON storage.objects
  FOR SELECT USING (bucket_id = 'pets_photos');

CREATE POLICY "pets_photos_insert_authenticated" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'pets_photos' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "pets_photos_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'pets_photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "pets_photos_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'pets_photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
