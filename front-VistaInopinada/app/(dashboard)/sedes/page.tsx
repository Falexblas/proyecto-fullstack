"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, ClipboardCheck, TrendingUp, Plus, MapPin, Phone, Mail } from "lucide-react"
import { RouteGuard } from "@/components/route-guard"

const sedes = [
  {
    id: "SEDE-001",
    nombre: "Lima Centro",
    direccion: "Av. Universitaria 1234, Lima",
    telefono: "(01) 234-5678",
    email: "lima.centro@universidad.edu.pe",
    docentes: 18,
    visitas: 68,
    cumplimiento: 89
  },
  {
    id: "SEDE-002",
    nombre: "Lima Norte",
    direccion: "Av. Tupac Amaru 4567, Comas",
    telefono: "(01) 345-6789",
    email: "lima.norte@universidad.edu.pe",
    docentes: 15,
    visitas: 52,
    cumplimiento: 85
  },
  {
    id: "SEDE-003",
    nombre: "Lima Sur",
    direccion: "Av. Pachacutec 7890, Villa El Salvador",
    telefono: "(01) 456-7890",
    email: "lima.sur@universidad.edu.pe",
    docentes: 15,
    visitas: 36,
    cumplimiento: 88
  },
]

export default function SedesPage() {
  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Sedes</h1>
          <p className="text-muted-foreground">
            Gestiona las sedes de la universidad
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Sede
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sedes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Docentes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">48</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visitas</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">156</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cumplimiento Prom.</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">87%</p>
          </CardContent>
        </Card>
      </div>

      {/* Sedes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sedes.map((sede) => (
          <Card key={sede.id} className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {sede.nombre}
                  </CardTitle>
                  <CardDescription className="mt-1">{sede.id}</CardDescription>
                </div>
                <Badge className="bg-success text-success-foreground">Activa</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">{sede.direccion}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{sede.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{sede.email}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div className="text-center">
                  <p className="text-xl font-bold">{sede.docentes}</p>
                  <p className="text-xs text-muted-foreground">Docentes</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{sede.visitas}</p>
                  <p className="text-xs text-muted-foreground">Visitas</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-success">{sede.cumplimiento}%</p>
                  <p className="text-xs text-muted-foreground">Cumpl.</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Detalle
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </RouteGuard>
  )
}
