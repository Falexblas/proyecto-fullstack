"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download, FileBarChart, TrendingUp, Users, Building2 } from "lucide-react"
import { CumplimientoChart } from "@/components/reportes/cumplimiento-chart"
import { VisitasPorSedeChart } from "@/components/reportes/visitas-por-sede-chart"
import { EvolucionChart } from "@/components/reportes/evolucion-chart"
import { RouteGuard } from "@/components/route-guard"

export default function ReportesPage() {
  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
      <ReportesContent />
    </RouteGuard>
  )
}

function ReportesContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground">
            Estadisticas y analisis del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="semester">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="semester">Este semestre</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visitas</CardTitle>
            <FileBarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">156</p>
            <p className="text-xs text-success">+23% vs semestre anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cumplimiento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">87%</p>
            <p className="text-xs text-success">+5% vs semestre anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Docentes Visitados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs text-muted-foreground">de 48 docentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sedes Activas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">con visitas registradas</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cumplimiento por Area</CardTitle>
            <CardDescription>
              Porcentaje de cumplimiento en cada area evaluada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CumplimientoChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visitas por Sede</CardTitle>
            <CardDescription>
              Distribucion de visitas entre sedes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VisitasPorSedeChart />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <Card>
        <CardHeader>
          <CardTitle>Evolucion del Cumplimiento</CardTitle>
          <CardDescription>
            Tendencia del cumplimiento general a lo largo del semestre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EvolucionChart />
        </CardContent>
      </Card>

      {/* Top Docentes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Docentes - Mayor Cumplimiento</CardTitle>
            <CardDescription>
              Docentes con mejor desempeno
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { nombre: "Roberto Guzman", cumplimiento: 100, visitas: 3 },
                { nombre: "Maria Garcia", cumplimiento: 95, visitas: 8 },
                { nombre: "Laura Sanchez", cumplimiento: 92, visitas: 6 },
                { nombre: "Sofia Herrera", cumplimiento: 88, visitas: 7 },
                { nombre: "Carlos Rodriguez", cumplimiento: 78, visitas: 5 },
              ].map((doc, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-lg font-bold text-muted-foreground w-6">{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium">{doc.nombre}</p>
                    <p className="text-xs text-muted-foreground">{doc.visitas} visitas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">{doc.cumplimiento}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requerimientos Pendientes</CardTitle>
            <CardDescription>
              Requerimientos de mejora por atender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { docente: "Pedro Martinez", descripcion: "Actualizar material virtual", fecha: "2026-04-05", prioridad: "alta" },
                { docente: "Carmen Ramos", descripcion: "Mejorar control de asistencia", fecha: "2026-04-04", prioridad: "media" },
                { docente: "Carlos Rodriguez", descripcion: "Actualizar avance silabico", fecha: "2026-04-06", prioridad: "media" },
                { docente: "Pedro Martinez", descripcion: "Rubrica de evaluacion", fecha: "2026-04-05", prioridad: "alta" },
              ].map((req, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${req.prioridad === 'alta' ? 'bg-destructive' : 'bg-warning'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{req.descripcion}</p>
                    <p className="text-xs text-muted-foreground">{req.docente}</p>
                    <p className="text-xs text-muted-foreground mt-1">{req.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
