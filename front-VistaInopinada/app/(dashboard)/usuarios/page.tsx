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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Shield, 
  UserCheck, 
  GraduationCap,
  Mail,
  Key,
  Eye,
  EyeOff
} from "lucide-react"

// Datos de ejemplo basados en la BD
const usuariosData = [
  {
    id_usuario: 1,
    email: "admin@universidad.edu.pe",
    nombres: "Carlos",
    apellidos: "Mendoza Lopez",
    rol: "ADMIN",
    estado: true,
    created_at: "2024-01-15",
    id_docente: null,
    id_responsable: null
  },
  {
    id_usuario: 2,
    email: "jperez@universidad.edu.pe",
    nombres: "Juan",
    apellidos: "Perez Garcia",
    rol: "AUDITOR",
    estado: true,
    created_at: "2024-02-10",
    id_docente: null,
    id_responsable: 1
  },
  {
    id_usuario: 3,
    email: "mhuerta@universidad.edu.pe",
    nombres: "Miguel Angel",
    apellidos: "Huerta Rojas",
    rol: "DOCENTE",
    estado: true,
    created_at: "2024-03-05",
    id_docente: 1,
    id_responsable: null
  },
  {
    id_usuario: 4,
    email: "lgarcia@universidad.edu.pe",
    nombres: "Laura",
    apellidos: "Garcia Torres",
    rol: "AUDITOR",
    estado: true,
    created_at: "2024-03-20",
    id_docente: null,
    id_responsable: 2
  },
  {
    id_usuario: 5,
    email: "rsanchez@universidad.edu.pe",
    nombres: "Roberto",
    apellidos: "Sanchez Diaz",
    rol: "DOCENTE",
    estado: false,
    created_at: "2024-04-01",
    id_docente: 2,
    id_responsable: null
  },
]

const rolesInfo = {
  ADMIN: { label: "Administrador", icon: Shield, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  AUDITOR: { label: "Auditor", icon: UserCheck, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  DOCENTE: { label: "Docente", icon: GraduationCap, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" }
}

export default function UsuariosPage() {
  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
      <UsuariosContent />
    </RouteGuard>
  )
}

function UsuariosContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRol, setFilterRol] = useState<string>("todos")
  const [isOpen, setIsOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newUser, setNewUser] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    rol: "",
    id_docente: "",
    id_responsable: ""
  })

  const filteredUsuarios = usuariosData.filter(usuario => {
    const matchSearch = 
      usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchRol = filterRol === "todos" || usuario.rol === filterRol
    
    return matchSearch && matchRol
  })

  const stats = {
    total: usuariosData.length,
    admins: usuariosData.filter(u => u.rol === "ADMIN").length,
    auditores: usuariosData.filter(u => u.rol === "AUDITOR").length,
    docentes: usuariosData.filter(u => u.rol === "DOCENTE").length,
    activos: usuariosData.filter(u => u.estado).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuarios del Sistema</h1>
          <p className="text-muted-foreground">
            Gestion de usuarios con roles exclusivos (Admin, Auditor, Docente)
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Ingrese los datos del nuevo usuario del sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombres">Nombres</Label>
                  <Input
                    id="nombres"
                    placeholder="Nombres"
                    value={newUser.nombres}
                    onChange={(e) => setNewUser({ ...newUser, nombres: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input
                    id="apellidos"
                    placeholder="Apellidos"
                    value={newUser.apellidos}
                    onChange={(e) => setNewUser({ ...newUser, apellidos: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Correo Electronico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@universidad.edu.pe"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  <Key className="h-4 w-4 inline mr-1" />
                  Contrasena
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contrasena segura"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol">Rol del Usuario</Label>
                <Select
                  value={newUser.rol}
                  onValueChange={(v) => setNewUser({ ...newUser, rol: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Administrador
                      </div>
                    </SelectItem>
                    <SelectItem value="AUDITOR">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Auditor
                      </div>
                    </SelectItem>
                    <SelectItem value="DOCENTE">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Docente
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newUser.rol === "DOCENTE" && (
                <div className="space-y-2">
                  <Label>Vincular con Docente</Label>
                  <Select
                    value={newUser.id_docente}
                    onValueChange={(v) => setNewUser({ ...newUser, id_docente: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar docente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Huerta Rojas Miguel Angel</SelectItem>
                      <SelectItem value="2">Garcia Lopez Maria</SelectItem>
                      <SelectItem value="3">Rodriguez Mendoza Carlos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {newUser.rol === "AUDITOR" && (
                <div className="space-y-2">
                  <Label>Vincular con Responsable</Label>
                  <Select
                    value={newUser.id_responsable}
                    onValueChange={(v) => setNewUser({ ...newUser, id_responsable: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Vicerrector Academico</SelectItem>
                      <SelectItem value="2">Decano de Facultad</SelectItem>
                      <SelectItem value="3">Director de Escuela</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Crear Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.activos} activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" /> Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserCheck className="h-4 w-4" /> Auditores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.auditores}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Docentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.docentes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.activos}</div>
            <p className="text-xs text-muted-foreground">{stats.total - stats.activos} inactivos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Usuarios
          </CardTitle>
          <CardDescription>
            Administre los usuarios del sistema y sus roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterRol} onValueChange={setFilterRol}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los roles</SelectItem>
                <SelectItem value="ADMIN">Administradores</SelectItem>
                <SelectItem value="AUDITOR">Auditores</SelectItem>
                <SelectItem value="DOCENTE">Docentes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Vinculacion</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.map((usuario) => {
                  const rolInfo = rolesInfo[usuario.rol as keyof typeof rolesInfo]
                  const RolIcon = rolInfo.icon
                  return (
                    <TableRow key={usuario.id_usuario}>
                      <TableCell>
                        <div className="font-medium">
                          {usuario.nombres} {usuario.apellidos}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {usuario.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={rolInfo.color}>
                          <RolIcon className="h-3 w-3 mr-1" />
                          {rolInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {usuario.id_docente && "Docente vinculado"}
                        {usuario.id_responsable && "Responsable vinculado"}
                        {!usuario.id_docente && !usuario.id_responsable && "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={usuario.estado ? "default" : "secondary"}>
                          {usuario.estado ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(usuario.created_at).toLocaleDateString("es-PE")}
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
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Key className="h-4 w-4 mr-2" />
                              Cambiar contrasena
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
