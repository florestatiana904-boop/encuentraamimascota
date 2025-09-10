import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-svh bg-gradient-to-b from-muted/30 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-balance">
            <span className="text-primary">Encuentra</span> a tu Mascota
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Una plataforma dedicada a reunir mascotas perdidas con sus familias. Reporta, busca y ayuda a otros en tu
            comunidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/sign-up">Comenzar Ahora</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/pets">Ver Mascotas</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Reporta Fácilmente</CardTitle>
              <CardDescription>Sube fotos y detalles de tu mascota perdida o encontrada en minutos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Nuestro formulario simple te permite reportar mascotas rápidamente con toda la información necesaria.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Búsqueda Inteligente</CardTitle>
              <CardDescription>Filtra por ubicación, especie, raza y más características</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Encuentra mascotas usando filtros avanzados para localizar exactamente lo que buscas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Comunidad Solidaria</CardTitle>
              <CardDescription>Conecta con otros dueños y voluntarios en tu área</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Únete a una red de personas comprometidas con ayudar a reunir mascotas con sus familias.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Perdiste a tu mascota?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            No pierdas tiempo. Cada minuto cuenta cuando se trata de encontrar a tu compañero peludo.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/auth/sign-up">Reportar Mascota Perdida</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
