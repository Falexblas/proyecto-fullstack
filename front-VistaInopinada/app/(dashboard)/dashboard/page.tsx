"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ClipboardCheck, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Plus,
  FileText
} from "lucide-react"
import { RecentVisitsTable } from "@/components/dashboard/recent-visits-table"
import { VisitsChart } from "@/components/dashboard/visits-chart"
import { useAuth, ROLE_PERMISSIONS } from "@/lib/auth-context"
import Link from "next/link"

// Stats para Admin y Evaluador
const adminStats = [
  {
    title: "Visitas Este Mes",
    value: "47",
    change: "+12%",
    changeType: "positive" as const,
    icon: ClipboardCheck,
    description: "vs mes anterior"
  },
  {
    title: "Docentes Evaluados",
    value: "32",
    change: "+8%",
    changeType: "positive" as const,
    icon: Users,
    description: "vs mes anterior"
  },
  {
    title: "Cumplimiento General",
    value: "89%",
    change: "+5%",
    changeType: "positive" as const,
    icon: CheckCircle2,
    description: "promedio evaluaciones"
  },
  {
    title: "Requerimientos Pendientes",
    value: "7",
    change: "-3",
    changeType: "negative" as const,
    icon: AlertTriangle,
    description: "por atender"
  },
]

// Stats para Docente
const docenteStats = [
  {
    title: "Mis Visitas Recibidas",
    value: "5",
    change: "",
    changeType: "positive" as const,
    icon: ClipboardCheck,
    description: "este semestre"
  },
  {
    title: "Cumplimiento",
    value: "92%",
    change: "+3%",
    changeType: "positive" as const,
    icon: CheckCircle2,
    description: "promedio general"
  },
  {
    title: "Requerimientos",
    value: "2",
    change: "",
    changeType: "negative" as const,
    icon: AlertTriangle,
    description: "pendientes de atencion"
  },
  {
    title: "Ultima Visita",
    value: "3",
    change: "",
    changeType: "positive" as const,
    icon: Calendar,
    description: "dias atras"
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const isDocente = user?.rol === "DOCENTE"
  const isAdmin = user?.rol === "ADMIN"
  const isAuditor = user?.rol === "AUDITOR"
  
  const stats = isDocente ? docenteStats : adminStats
  const roleInfo = user ? ROLE_PERMISSIONS[user.rol] : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            {isDocente ? "Mi Panel" : "Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {isDocente 
              ? "Resumen de tus visitas y evaluaciones"
              : "Resumen general del sistema de visitas inopinadas"
            }
          </p>
        </div>

        {/* Quick Actions - Solo para Admin y Auditor */}
        {(isAdmin || isAuditor) && (
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/visitas/nueva">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Visita
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Role Badge */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-sm">
          Conectado como <strong>{roleInfo?.label}</strong> - {roleInfo?.description}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <div className="flex items-center gap-1 mt-1">
                  <span className={
                    stat.changeType === "positive" 
                      ? "text-success text-xs font-medium" 
                      : "text-destructive text-xs font-medium"
                  }>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">{stat.description}</span>
                </div>
              )}
              {!stat.change && (
                <span className="text-xs text-muted-foreground">{stat.description}</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Tables - Diferente segun rol */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Chart - Solo Admin y Auditor */}
        {!isDocente && (
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Visitas por Semana
              </CardTitle>
              <CardDescription>
                Cantidad de visitas realizadas en las ultimas 8 semanas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VisitsChart />
            </CardContent>
          </Card>
        )}

        {/* Proximas Visitas / Mis Requerimientos */}
        <Card className={isDocente ? "lg:col-span-7" : "lg:col-span-3"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isDocente ? <FileText className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
              {isDocente ? "Mis Requerimientos Pendientes" : "Proximas Visitas Programadas"}
            </CardTitle>
            <CardDescription>
              {isDocente 
                ? "Requerimientos que debes atender" 
                : "Visitas pendientes para esta semana"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isDocente ? (
              // Requerimientos para docente
              <>
                {[
                  { tipo: "Actualizacion de Silabo", fecha: "Hace 2 dias", estado: "pendiente" },
                  { tipo: "Registro de Asistencia", fecha: "Hace 5 dias", estado: "en_proceso" },
                ].map((req, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      req.estado === "pendiente" ? "bg-destructive" : "bg-warning"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{req.tipo}</p>
                      <p className="text-xs text-muted-foreground">{req.fecha}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      req.estado === "pendiente" 
                        ? "bg-destructive/10 text-destructive" 
                        : "bg-warning/10 text-warning"
                    }`}>
                      {req.estado === "pendiente" ? "Pendiente" : "En Proceso"}
                    </span>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/requerimientos">Ver todos mis requerimientos</Link>
                </Button>
              </>
            ) : (
              // Proximas visitas para Admin/Auditor
              <>
                {[
                  { docente: "Maria Garcia", asignatura: "Matematicas I", fecha: "Hoy 10:00", sede: "Lima Centro" },
                  { docente: "Carlos Lopez", asignatura: "Fisica II", fecha: "Hoy 14:30", sede: "Lima Norte" },
                  { docente: "Ana Torres", asignatura: "Quimica General", fecha: "Manana 09:00", sede: "Lima Centro" },
                ].map((visita, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{visita.docente}</p>
                      <p className="text-xs text-muted-foreground truncate">{visita.asignatura}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-primary">{visita.fecha}</span>
                        <span className="text-xs text-muted-foreground">- {visita.sede}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Visits Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isDocente ? "Mis Visitas Recientes" : "Visitas Recientes"}
          </CardTitle>
          <CardDescription>
            {isDocente 
              ? "Ultimas visitas realizadas a tus clases"
              : "Ultimas visitas realizadas en el sistema"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentVisitsTable showOnlyMine={isDocente} />
        </CardContent>
      </Card>
    </div>
  )
}
