"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Calendar, Phone, Mail } from "lucide-react"
import Link from "next/link"

interface Pet {
  id: string
  name: string
  species: string
  breed?: string
  color?: string
  size?: string
  age_range?: string
  gender?: string
  status: "perdido" | "encontrado"
  description?: string
  last_seen_location?: string
  last_seen_date?: string
  contact_phone?: string
  contact_email?: string
  photo_url?: string
  created_at: string
  profiles?: {
    full_name?: string
  }
}

interface PetListingsProps {
  initialPets: Pet[]
}

export function PetListings({ initialPets }: PetListingsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/pets?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim())
    } else {
      params.delete("search")
    }
    router.push(`/pets?${params.toString()}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    return status === "perdido" ? "destructive" : "secondary"
  }

  const getStatusText = (status: string) => {
    return status === "perdido" ? "Perdido" : "Encontrado"
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, raza, color o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            <Button type="submit" onClick={handleSearch}>
              Buscar
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select
              value={searchParams.get("status") || "all"}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="perdido">Perdidos</SelectItem>
                <SelectItem value="encontrado">Encontrados</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={searchParams.get("species") || "all"}
              onValueChange={(value) => handleFilterChange("species", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Especie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="perro">Perros</SelectItem>
                <SelectItem value="gato">Gatos</SelectItem>
                <SelectItem value="otro">Otros</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={searchParams.get("size") || "all"}
              onValueChange={(value) => handleFilterChange("size", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tamaño" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pequeño">Pequeño</SelectItem>
                <SelectItem value="mediano">Mediano</SelectItem>
                <SelectItem value="grande">Grande</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Ubicación..."
              value={searchParams.get("location") || ""}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Pet Grid */}
      {initialPets.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialPets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <img
                  src={pet.photo_url || "/placeholder.svg?height=300&width=300&query=pet"}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={getStatusColor(pet.status)}>{getStatusText(pet.status)}</Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pet.species} {pet.breed && `• ${pet.breed}`} {pet.color && `• ${pet.color}`}
                    </p>
                  </div>

                  {pet.last_seen_location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{pet.last_seen_location}</span>
                    </div>
                  )}

                  {pet.last_seen_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(pet.last_seen_date)}</span>
                    </div>
                  )}

                  {pet.description && <p className="text-sm text-muted-foreground line-clamp-2">{pet.description}</p>}

                  <div className="flex flex-col gap-2 pt-2">
                    <Button asChild className="w-full">
                      <Link href={`/pets/${pet.id}`}>Ver Detalles</Link>
                    </Button>

                    <div className="flex gap-2">
                      {pet.contact_phone && (
                        <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                          <a href={`tel:${pet.contact_phone}`}>
                            <Phone className="h-4 w-4 mr-1" />
                            Llamar
                          </a>
                        </Button>
                      )}
                      {pet.contact_email && (
                        <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                          <a href={`mailto:${pet.contact_email}`}>
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Reportado por {pet.profiles?.full_name || "Usuario"} • {formatDate(pet.created_at)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No se encontraron mascotas con los filtros seleccionados.</p>
            <Button asChild>
              <Link href="/dashboard/report-pet">Reportar Primera Mascota</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
