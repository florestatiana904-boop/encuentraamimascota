"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { LogOut } from "lucide-react"

interface ProfileFormProps {
  user: {
    id: string
    email?: string
    created_at: string
  }
  profile: {
    id: string
    full_name?: string
    phone?: string
  } | null
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const formData = new FormData(e.currentTarget)

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: formData.get("full_name") as string,
          phone: formData.get("phone") as string,
        })
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido guardada exitosamente.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error al actualizar perfil",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error al cerrar sesión",
        description: "No se pudo cerrar la sesión. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user.email || ""} disabled className="bg-muted" />
          <p className="text-sm text-muted-foreground">El email no se puede cambiar</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name">Nombre Completo</Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="Tu nombre completo"
            defaultValue={profile?.full_name || ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Tu número de teléfono"
            defaultValue={profile?.phone || ""}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </form>

      <div className="pt-6 border-t">
        <Button variant="destructive" onClick={handleSignOut} disabled={isSigningOut} className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          {isSigningOut ? "Cerrando sesión..." : "Cerrar Sesión"}
        </Button>
      </div>
    </div>
  )
}
