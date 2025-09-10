import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Phone, Mail, ArrowLeft, User } from "lucide-react"
import Link from "next/link"

export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  const { data: pet, error } = await supabase
    .from("pets")
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        phone
      )
    `,
    )
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (error || !pet) {
    notFound()
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
    <div className="min-h-svh bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button asChild variant="outline">
              <Link href="/pets">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la Lista
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Pet Image */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={pet.photo_url || "/placeholder.svg?height=500&width=500&query=pet"}
                    alt={pet.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant={getStatusColor(pet.status)} className="text-lg px-3 py-1">
                      {getStatusText(pet.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pet Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{pet.name}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{pet.species}</Badge>
                    {pet.breed && <Badge variant="outline">{pet.breed}</Badge>}
                    {pet.size && <Badge variant="outline">{pet.size}</Badge>}
                    {pet.age_range && <Badge variant="outline">{pet.age_range}</Badge>}
                    {pet.gender && <Badge variant="outline">{pet.gender}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pet.color && (
                    <div>
                      <h4 className="font-semibold mb-1">Color</h4>
                      <p className="text-muted-foreground">{pet.color}</p>
                    </div>
                  )}

                  {pet.description && (
                    <div>
                      <h4 className="font-semibold mb-1">Descripción</h4>
                      <p className="text-muted-foreground">{pet.description}</p>
                    </div>
                  )}

                  {pet.last_seen_location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-semibold">
                          {pet.status === "perdido" ? "Última ubicación vista" : "Ubicación encontrada"}
                        </h4>
                        <p className="text-muted-foreground">{pet.last_seen_location}</p>
                      </div>
                    </div>
                  )}

                  {pet.last_seen_date && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-semibold">
                          {pet.status === "perdido" ? "Fecha que se perdió" : "Fecha que se encontró"}
                        </h4>
                        <p className="text-muted-foreground">{formatDate(pet.last_seen_date)}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>Reportado por: {pet.profiles?.full_name || "Usuario"}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {pet.contact_phone && (
                      <Button asChild className="w-full">
                        <a href={`tel:${pet.contact_phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          Llamar: {pet.contact_phone}
                        </a>
                      </Button>
                    )}

                    {pet.contact_email && (
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <a href={`mailto:${pet.contact_email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar Email
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground pt-4 border-t">
                    Reportado el {formatDate(pet.created_at)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
