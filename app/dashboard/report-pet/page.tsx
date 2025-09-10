import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PetReportForm } from "@/components/pet-report-form"

export default async function ReportPetPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const defaultStatus = params.status === "encontrado" ? "encontrado" : "perdido"

  return (
    <div className="min-h-svh bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {defaultStatus === "perdido" ? "Reportar Mascota Perdida" : "Reportar Mascota Encontrada"}
            </h1>
            <p className="text-muted-foreground">
              {defaultStatus === "perdido"
                ? "Completa la información para que la comunidad te ayude a encontrar a tu mascota."
                : "Ayuda a reunir esta mascota con su familia proporcionando los detalles."}
            </p>
          </div>
          <PetReportForm defaultStatus={defaultStatus} />
        </div>
      </div>
    </div>
  )
}
