"use client"

import { VisitaForm } from "@/components/visitas/visita-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { RouteGuard } from "@/components/route-guard"

export default function NuevaVisitaPage() {
  return (
    <RouteGuard allowedRoles={["AUDITOR"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/visitas">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Nueva Visita Inopinada</h1>
            <p className="text-muted-foreground">
              Complete el formulario para registrar una nueva visita
            </p>
          </div>
        </div>

        {/* Form */}
        <VisitaForm />
      </div>
    </RouteGuard>
  )
}
