import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user's profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user's pets
  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-svh bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Panel de Control</h1>
              <p className="text-muted-foreground">Bienvenido, {profile?.full_name || user.email}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/dashboard/report-pet">Reportar Mascota</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pets">Ver Todas las Mascotas</Link>
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Reportar Mascota Perdida</CardTitle>
                <CardDescription>
                  ¿Perdiste a tu mascota? Repórtala para que la comunidad te ayude a encontrarla.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/report-pet?status=perdido">Reportar Perdida</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Reportar Mascota Encontrada</CardTitle>
                <CardDescription>¿Encontraste una mascota? Ayuda a reunirla con su familia.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/dashboard/report-pet?status=encontrado">Reportar Encontrada</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* User's Pets */}
          <Card>
            <CardHeader>
              <CardTitle>Mis Reportes</CardTitle>
              <CardDescription>Mascotas que has reportado ({pets?.length || 0})</CardDescription>
            </CardHeader>
            <CardContent>
              {pets && pets.length > 0 ? (
                <div className="grid gap-4">
                  {pets.map((pet) => (
                    <div key={pet.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      {pet.photo_url && (
                        <img
                          src={pet.photo_url || "/placeholder.svg"}
                          alt={pet.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{pet.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {pet.species} • {pet.status} • {new Date(pet.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/edit-pet/${pet.id}`}>Editar</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No has reportado ninguna mascota aún.</p>
                  <Button asChild>
                    <Link href="/dashboard/report-pet">Reportar Primera Mascota</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
