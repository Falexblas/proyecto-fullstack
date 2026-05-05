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
import { Plus, Search, MoreHorizontal, Eye, Edit } from "lucide-react"
import { RouteGuard } from "@/components/route-guard"

const asignaturas = [
  { id: "ASIG-001", nombre: "Matematicas I", campoFormativo: "Ciencias Basicas", ciclo: "I", turno: "Manana", docentes: 3, visitas: 12 },
  { id: "ASIG-002", nombre: "Fisica II", campoFormativo: "Ciencias Basicas", ciclo: "IV", turno: "Tarde", docentes: 2, visitas: 8 },
  { id: "ASIG-003", nombre: "Quimica General", campoFormativo: "Ciencias Basicas", ciclo: "II", turno: "Manana", docentes: 2, visitas: 10 },
  { id: "ASIG-004", nombre: "Biologia Molecular", campoFormativo: "Especialidad", ciclo: "V", turno: "Noche", docentes: 1, visitas: 5 },
  { id: "ASIG-005", nombre: "Calculo III", campoFormativo: "Ciencias Basicas", ciclo: "IV", turno: "Manana", docentes: 2, visitas: 9 },
  { id: "ASIG-006", nombre: "Estadistica", campoFormativo: "Ciencias Basicas", ciclo: "III", turno: "Tarde", docentes: 2, visitas: 6 },
  { id: "ASIG-007", nombre: "Programacion I", campoFormativo: "Especialidad", ciclo: "II", turno: "Manana", docentes: 3, visitas: 11 },
  { id: "ASIG-008", nombre: "Algebra Lineal", campoFormativo: "Ciencias Basicas", ciclo: "II", turno: "Tarde", docentes: 2, visitas: 7 },
]

export default function AsignaturasPage() {
  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Asignaturas</h1>
          <p className="text-muted-foreground">
            Gestiona las asignaturas del programa
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Asignatura
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Asignaturas</CardTitle>
          <CardDescription>
            Todas las asignaturas registradas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar asignatura..." className="pl-10" />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asignatura</TableHead>
                  <TableHead className="hidden md:table-cell">Campo Formativo</TableHead>
                  <TableHead className="hidden sm:table-cell">Ciclo</TableHead>
                  <TableHead className="hidden lg:table-cell">Turno</TableHead>
                  <TableHead className="hidden sm:table-cell">Docentes</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead className="w-[60px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {asignaturas.map((asig) => (
                  <TableRow key={asig.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{asig.nombre}</p>
                        <p className="text-xs text-muted-foreground md:hidden">{asig.campoFormativo}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{asig.campoFormativo}</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">Ciclo {asig.ciclo}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{asig.turno}</TableCell>
                    <TableCell className="hidden sm:table-cell">{asig.docentes}</TableCell>
                    <TableCell>
                      <Badge>{asig.visitas}</Badge>
                    </TableCell>
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
                            Ver detalle
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
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
    </RouteGuard>
  )
}
