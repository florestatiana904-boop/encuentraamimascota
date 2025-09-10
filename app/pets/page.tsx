import { createClient } from "@/lib/supabase/server"
import { PetListings } from "@/components/pet-listings"

export default async function PetsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    species?: string
    status?: string
    size?: string
    location?: string
  }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  // Build query with filters
  let query = supabase
    .from("pets")
    .select(
      `
      *,
      profiles:user_id (
        full_name
      )
    `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Apply filters
  if (params.search) {
    query = query.or(
      `name.ilike.%${params.search}%,breed.ilike.%${params.search}%,color.ilike.%${params.search}%,last_seen_location.ilike.%${params.search}%`,
    )
  }

  if (params.species) {
    query = query.eq("species", params.species)
  }

  if (params.status) {
    query = query.eq("status", params.status)
  }

  if (params.size) {
    query = query.eq("size", params.size)
  }

  if (params.location) {
    query = query.ilike("last_seen_location", `%${params.location}%`)
  }

  const { data: pets, error } = await query

  if (error) {
    console.error("Error fetching pets:", error)
  }

  return (
    <div className="min-h-svh bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Mascotas Perdidas y Encontradas</h1>
            <p className="text-muted-foreground">
              Ayuda a reunir mascotas con sus familias. {pets?.length || 0} mascotas reportadas.
            </p>
          </div>

          <PetListings initialPets={pets || []} />
        </div>
      </div>
    </div>
  )
}
