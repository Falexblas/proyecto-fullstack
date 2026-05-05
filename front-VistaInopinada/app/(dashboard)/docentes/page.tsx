"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Eye, Edit, Mail, CheckCircle2, XCircle } from "lucide-react"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/lib/auth-context"

const docentes = [
  {
    id: "DOC-001",
    nombres: "Maria",
    apellidos: "Garcia Lopez",
    email: "maria.garcia@universidad.edu.pe",
    estado: true,
    asignaturas: ["Matematicas I", "Calculo I"],
    visitas: 8,
    cumplimiento: 95
  },
  {
    id: "DOC-002",
    nombres: "Carlos",
    apellidos: "Rodriguez Mendoza",
    email: "carlos.rodriguez@universidad.edu.pe",
    estado: true,
    asignaturas: ["Fisica II"],
    visitas: 5,
    cumplimiento: 78
  },
  {
    id: "DOC-003",
    nombres: "Laura",
    apellidos: "Sanchez Diaz",
    email: "laura.sanchez@universidad.edu.pe",
    estado: true,
    asignaturas: ["Quimica General", "Quimica Organica"],
    visitas: 6,
    cumplimiento: 92
  },
  {
    id: "DOC-004",
    nombres: "Pedro",
    apellidos: "Martinez Valle",
    email: "pedro.martinez@universidad.edu.pe",
    estado: false,
    asignaturas: ["Biologia Molecular"],
    visitas: 4,
    cumplimiento: 65
  },
  {
    id: "DOC-005",
    nombres: "Sofia",
    apellidos: "Herrera Cruz",
    email: "sofia.herrera@universidad.edu.pe",
    estado: true,
    asignaturas: ["Calculo III", "Algebra Lineal"],
    visitas: 7,
    cumplimiento: 88
  },
  {
    id: "DOC-006",
    nombres: "Roberto",
    apellidos: "Guzman Vega",
    email: "roberto.guzman@universidad.edu.pe",
    estado: true,
    asignaturas: ["Estadistica"],
    visitas: 3,
    cumplimiento: 100
  },
]

export default function DocentesPage() {
  const { user } = useAuth()
  const isAdmin = user?.rol === "ADMIN"
  
  return (
    <RouteGuard allowedRoles={["ADMIN", "AUDITOR"]}>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Docentes</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Gestiona la informacion de docentes" : "Consulta la informacion de docentes"}
          </p>
        </div>
        {isAdmin && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Docente
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Docentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">48</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">45</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-muted-foreground">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cumplimiento Prom.</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">87%</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Docentes</CardTitle>
          <CardDescription>
            Todos los docentes registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar docente..." className="pl-10" />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Docente</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Asignaturas</TableHead>
                  <TableHead className="hidden sm:table-cell">Visitas</TableHead>
                  <TableHead>Estado</TableHead>
                  {isAdmin && <TableHead className="w-[60px]">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {docentes.map((docente) => (
                  <TableRow key={docente.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {docente.nombres[0]}{docente.apellidos[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{docente.nombres} {docente.apellidos}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{docente.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{docente.email}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {docente.asignaturas.slice(0, 2).map((asig, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {asig}
                          </Badge>
                        ))}
                        {docente.asignaturas.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{docente.asignaturas.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <p className="font-medium">{docente.visitas}</p>
                        <p className="text-xs text-muted-foreground">{docente.cumplimiento}% cumpl.</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {docente.estado ? (
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactivo
                        </Badge>
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Enviar correo
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
    </RouteGuard>
  )
}
