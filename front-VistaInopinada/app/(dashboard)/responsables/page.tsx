"use client"

import { useState } from "react"
import { RouteGuard } from "@/components/route-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  UserCheck, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Mail,
  Briefcase,
  ClipboardList
} from "lucide-react"

// Datos de ejemplo basados en la BD - ResponsableVisita
const responsablesData = [
  {
    id_responsable: 1,
    nombres: "Dr. Carlos",
    apellidos: "Mendoza Quispe",
    cargo: "Vicerrector Academico",
    email: "vicerrector@universidad.edu.pe",
    visitas_realizadas: 45,
    activo: true
  },
  {
    id_responsable: 2,
    nombres: "Mg. Maria Elena",
    apellidos: "Torres Ramirez",
    cargo: "Decana de Facultad de Ingenierias",
    email: "decana.ingenierias@universidad.edu.pe",
    visitas_realizadas: 32,
    activo: true
  },
  {
    id_responsable: 3,
    nombres: "Ing. Juan Pablo",
    apellidos: "Garcia Fernandez",
    cargo: "Director de Escuela de Sistemas",
    email: "director.sistemas@universidad.edu.pe",
    visitas_realizadas: 28,
    activo: true
  },
  {
    id_responsable: 4,
    nombres: "Lic. Rosa",
    apellidos: "Sanchez Paredes",
    cargo: "Coordinadora de Calidad Academica",
    email: "calidad@universidad.edu.pe",
    visitas_realizadas: 56,
    activo: true
  },
  {
    id_responsable: 5,
    nombres: "Dr. Pedro",
    apellidos: "Villanueva Lopez",
    cargo: "Decano de Facultad de Ciencias",
    email: "decano.ciencias@universidad.edu.pe",
    visitas_realizadas: 18,
    activo: false
  },
]

export default function ResponsablesPage() {
  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
      <ResponsablesContent />
    </RouteGuard>
  )
}

function ResponsablesContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [newResponsable, setNewResponsable] = useState({
    nombres: "",
    apellidos: "",
    cargo: "",
    email: ""
  })

  const filteredResponsables = responsablesData.filter(resp => 
    resp.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resp.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resp.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resp.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: responsablesData.length,
    activos: responsablesData.filter(r => r.activo).length,
    totalVisitas: responsablesData.reduce((acc, r) => acc + r.visitas_realizadas, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Responsables de Visita</h1>
          <p className="text-muted-foreground">
            Gestion de auditores y responsables de las visitas inopinadas
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Responsable
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Responsable de Visita</DialogTitle>
              <DialogDescription>
                Ingrese los datos del responsable/auditor de visitas inopinadas
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombres">Nombres</Label>
                  <Input
                    id="nombres"
                    placeholder="Nombres"
                    value={newResponsable.nombres}
                    onChange={(e) => setNewResponsable({ ...newResponsable, nombres: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input
                    id="apellidos"
                    placeholder="Apellidos"
                    value={newResponsable.apellidos}
                    onChange={(e) => setNewResponsable({ ...newResponsable, apellidos: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">
                  <Briefcase className="h-4 w-4 inline mr-1" />
                  Cargo
                </Label>
                <Input
                  id="cargo"
                  placeholder="Ej: Vicerrector Academico, Decano, Director de Escuela"
                  value={newResponsable.cargo}
                  onChange={(e) => setNewResponsable({ ...newResponsable, cargo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Correo Electronico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="responsable@universidad.edu.pe"
                  value={newResponsable.email}
                  onChange={(e) => setNewResponsable({ ...newResponsable, email: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Registrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Responsables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.activos} activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Visitas Realizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisitas}</div>
            <p className="text-xs text-muted-foreground">En total acumulado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Promedio por Responsable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {Math.round(stats.totalVisitas / stats.total)}
            </div>
            <p className="text-xs text-muted-foreground">visitas por responsable</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Lista de Responsables
          </CardTitle>
          <CardDescription>
            Personal autorizado para realizar visitas inopinadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, cargo o email..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Visitas Realizadas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResponsables.map((responsable) => (
                  <TableRow key={responsable.id_responsable}>
                    <TableCell>
                      <div className="font-medium">
                        {responsable.nombres} {responsable.apellidos}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {responsable.cargo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {responsable.email}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {responsable.visitas_realizadas}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={responsable.activo ? "default" : "secondary"}>
                        {responsable.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <ClipboardList className="h-4 w-4 mr-2" />
                            Ver visitas
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
