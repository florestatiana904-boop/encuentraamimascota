"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MessageCircle, Mail, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"

interface LostPet {
  id: string
  user_id: string
  photo_url: string | null
  alt_text: string | null
  description: string
  zone: string
  found_date: string
  contact_method: "whatsapp" | "gmail"
  contact_info: string
  resolved: boolean
  created_at: string
  profiles?: {
    full_name: string | null
  }
}

interface LostPetListingsProps {
  initialPets: LostPet[]
}

export function LostPetListings({ initialPets }: LostPetListingsProps) {
  const [pets, setPets] = useState<LostPet[]>(initialPets)
  const [searchTerm, setSearchTerm] = useState("")
  const [resolvedFilter, setResolvedFilter] = useState("all")
  const [contactMethodFilter, setContactMethodFilter] = useState("all")
  const [zoneFilter, setZoneFilter] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)

  const supabase = createBrowserClient()
  const router = useRouter()

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    getUser()
  }, [supabase.auth])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (resolvedFilter !== "all") params.set("resolved", resolvedFilter)
    if (contactMethodFilter !== "all") params.set("contact_method", contactMethodFilter)
    if (zoneFilter) params.set("zone", zoneFilter)

    router.push(`/?${params.toString()}`)
  }

  const handleContact = (pet: LostPet) => {
    if (pet.contact_method === "whatsapp") {
      window.open(`https://wa.me/${pet.contact_info}`, "_blank")
    } else if (pet.contact_method === "gmail") {
      window.open(`mailto:${pet.contact_info}`, "_blank")
    }
  }

  const handleMarkResolved = async (petId: string) => {
    const { error } = await supabase.from("lost_pets").update({ resolved: true }).eq("id", petId)

    if (error) {
      toast.error("Error al marcar como resuelto")
    } else {
      toast.success("Reporte marcado como resuelto")
      // Update local state
      setPets(pets.map((pet) => (pet.id === petId ? { ...pet, resolved: true } : pet)))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Mascotas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar por descripción, zona..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Input placeholder="Filtrar por zona" value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} />
            <Select value={resolvedFilter} onValueChange={setResolvedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="false">Activos</SelectItem>
                <SelectItem value="true">Resueltos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={contactMethodFilter} onValueChange={setContactMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Método de contacto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los métodos</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="gmail">Gmail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSearch} className="w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </CardContent>
      </Card>

      {/* Pet Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <Card key={pet.id} className={`overflow-hidden ${pet.resolved ? "opacity-75" : ""}`}>
            <div className="relative">
              {pet.photo_url && (
                <Image
                  src={pet.photo_url || "/placeholder.svg"}
                  alt={pet.alt_text || "Foto de mascota"}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              )}
              {pet.resolved && (
                <Badge className="absolute top-2 right-2 bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Encontrado
                </Badge>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{pet.description}</CardTitle>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Zona:</strong> {pet.zone}
                </p>
                <p>
                  <strong>Encontrado:</strong> {formatDate(pet.found_date)}
                </p>
                <p>
                  <strong>Reportado por:</strong> {pet.profiles?.full_name || "Usuario"}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleContact(pet)}
                className="w-full"
                variant={pet.resolved ? "secondary" : "default"}
                disabled={pet.resolved}
              >
                {pet.contact_method === "whatsapp" ? (
                  <MessageCircle className="h-4 w-4 mr-2" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Contactar por {pet.contact_method === "whatsapp" ? "WhatsApp" : "Gmail"}
              </Button>

              {currentUser && currentUser.id === pet.user_id && !pet.resolved && (
                <Button onClick={() => handleMarkResolved(pet.id)} variant="outline" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar como resuelto
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {pets.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No se encontraron reportes de mascotas.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
