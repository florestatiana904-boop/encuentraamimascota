import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted/30">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Encuentra a tu Mascota</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">¡Gracias por registrarte!</CardTitle>
              <CardDescription>Revisa tu email para confirmar tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Te has registrado exitosamente. Por favor revisa tu email para confirmar tu cuenta antes de iniciar
                sesión.
              </p>
              <div className="text-center">
                <Button asChild variant="outline">
                  <Link href="/auth/login">Volver al Inicio de Sesión</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
