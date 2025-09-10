"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

interface PetReportFormProps {
  defaultStatus: "perdido" | "encontrado"
}

export function PetReportForm({ defaultStatus }: PetReportFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Usuario no autenticado")
      }

      const formData = new FormData(e.currentTarget)
      let photoUrl = null

      // Upload photo if provided
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from("pet-photos").upload(fileName, photoFile)

        if (uploadError) {
          throw uploadError
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("pet-photos").getPublicUrl(fileName)
        photoUrl = publicUrl
      }

      // Insert pet data
      const { error: insertError } = await supabase.from("pets").insert({
        user_id: user.id,
        name: formData.get("name") as string,
        species: formData.get("species") as string,
        breed: formData.get("breed") as string,
        color: formData.get("color") as string,
        size: formData.get("size") as string,
        age_range: formData.get("age_range") as string,
        gender: formData.get("gender") as string,
        status: formData.get("status") as string,
        description: formData.get("description") as string,
        last_seen_location: formData.get("last_seen_location") as string,
        last_seen_date: formData.get("last_seen_date") as string,
        contact_phone: formData.get("contact_phone") as string,
        contact_email: formData.get("contact_email") as string,
        photo_url: photoUrl,
      })

      if (insertError) {
        throw insertError
      }

      toast({
        title: "Mascota reportada exitosamente",
        description: "Tu reporte ha sido publicado y la comunidad podrá verlo.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error al reportar mascota",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de la Mascota</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="photo">Foto de la Mascota</Label>
            <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="cursor-pointer" />
            {photoPreview && (
              <div className="mt-2">
                <img
                  src={photoPreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label>Estado</Label>
            <RadioGroup defaultValue={defaultStatus} name="status">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="perdido" id="perdido" />
                <Label htmlFor="perdido">Perdido</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="encontrado" id="encontrado" />
                <Label htmlFor="encontrado">Encontrado</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Mascota</Label>
              <Input id="name" name="name" placeholder="Ej: Max, Luna" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">Especie</Label>
              <Select name="species" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la especie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perro">Perro</SelectItem>
                  <SelectItem value="gato">Gato</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breed">Raza</Label>
              <Input id="breed" name="breed" placeholder="Ej: Labrador, Mestizo" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" placeholder="Ej: Marrón, Negro y blanco" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Tamaño</Label>
              <Select name="size">
                <SelectTrigger>
                  <SelectValue placeholder="Tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pequeño">Pequeño</SelectItem>
                  <SelectItem value="mediano">Mediano</SelectItem>
                  <SelectItem value="grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age_range">Edad Aproximada</Label>
              <Select name="age_range">
                <SelectTrigger>
                  <SelectValue placeholder="Edad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cachorro">Cachorro</SelectItem>
                  <SelectItem value="joven">Joven</SelectItem>
                  <SelectItem value="adulto">Adulto</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select name="gender">
                <SelectTrigger>
                  <SelectValue placeholder="Género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="macho">Macho</SelectItem>
                  <SelectItem value="hembra">Hembra</SelectItem>
                  <SelectItem value="desconocido">Desconocido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location and Date */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="last_seen_location">
                {defaultStatus === "perdido" ? "Última ubicación vista" : "Ubicación encontrada"}
              </Label>
              <Input
                id="last_seen_location"
                name="last_seen_location"
                placeholder="Ej: Parque Central, Calle 123"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_seen_date">
                {defaultStatus === "perdido" ? "Fecha que se perdió" : "Fecha que se encontró"}
              </Label>
              <Input id="last_seen_date" name="last_seen_date" type="date" required />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción Adicional</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe características especiales, comportamiento, circunstancias, etc."
              rows={4}
            />
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
              <Input id="contact_phone" name="contact_phone" type="tel" placeholder="Tu número de teléfono" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Email de Contacto</Label>
              <Input id="contact_email" name="contact_email" type="email" placeholder="tu@email.com" required />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Reportando..." : "Reportar Mascota"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
