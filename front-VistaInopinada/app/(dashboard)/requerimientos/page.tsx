"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import { useToast } from "@/hooks/use-toast"
import { requerimientosService, type RequerimientoVisita } from "@/services/requerimientos.service"
import {
  AlertCircle,
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  FileText,
  Filter,
} from "lucide-react"

const estadoConfig = {
  pendiente: {
    label: "Pendiente",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  en_proceso: {
    label: "En Proceso",
    icon: AlertCircle,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  atendido: {
    label: "Atendido",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  rechazado: {
    label: "Rechazado",
    icon: XCircle,
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
}

const normalizeEstado = (estado?: string) =>
  estado?.toLowerCase().replace(" ", "_") as keyof typeof estadoConfig

export default function RequerimientosPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const isDocente = user?.rol === "DOCENTE"
  const canRespond = user?.rol === "ADMIN" || user?.rol === "AUDITOR"

  const [requerimientos, setRequerimientos] = useState<RequerimientoVisita[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("todos")
  const [selectedReq, setSelectedReq] = useState<RequerimientoVisita | null>(null)
  const [respuesta, setRespuesta] = useState("")
  const [nuevoEstado, setNuevoEstado] = useState<string>("")

  useEffect(() => {
    cargarRequerimientos()
  }, [])

  const cargarRequerimientos = async () => {
    try {
      setLoading(true)
      const data = await requerimientosService.listAll()
      setRequerimientos(data)
    } catch (error) {
      console.error("Error al cargar requerimientos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los requerimientos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isResponderDisabled = !nuevoEstado || !respuesta.trim()

  const handleResponder = async () => {
    if (!selectedReq) return

    if (!nuevoEstado) {
      toast({
        title: "Error",
        description: "Selecciona un estado para el requerimiento",
        variant: "destructive",
      })
      return
    }

    if (!respuesta.trim()) {
      toast({
        title: "Error",
        description: "Completa el campo de respuesta antes de guardar",
        variant: "destructive",
      })
      return
    }

    try {
      await requerimientosService.update(selectedReq.id, {
        estado: nuevoEstado.toUpperCase(),
        respuesta: respuesta.trim(),
        fechaRespuesta: new Date().toISOString().split("T")[0],
      })

      toast({
        title: "Éxito",
        description: "Requerimiento actualizado correctamente",
      })
      setSelectedReq(null)
      setRespuesta("")
      setNuevoEstado("")
      cargarRequerimientos()
    } catch (error) {
      console.error("Error al responder requerimiento:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el requerimiento",
        variant: "destructive",
      })
    }
  }

  const handleOpenRequerimiento = (req: RequerimientoVisita) => {
    setSelectedReq(req)
    setRespuesta(req.respuesta || "")
    setNuevoEstado(req.estado?.toLowerCase() || "pendiente")
  }

  const fullDocenteName = user ? `${user.nombre} ${user.apellido}` : ""

  const baseData = isDocente
    ? requerimientos.filter((req) =>
        req.nombreDocente?.toLowerCase() === fullDocenteName.toLowerCase()
      )
    : requerimientos

  const filteredRequerimientos = baseData.filter((req) => {
    const matchSearch =
      req.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.nombreDocente ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.nombreAsignatura ?? "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchEstado = filterEstado === "todos" || req.estado?.toLowerCase() === filterEstado

    return matchSearch && matchEstado
  })

  const stats = {
    total: baseData.length,
    pendientes: baseData.filter((r) => r.estado?.toLowerCase() === "pendiente").length,
    enProceso: baseData.filter((r) => r.estado?.toLowerCase() === "en_proceso").length,
    atendidos: baseData.filter((r) => r.estado?.toLowerCase() === "atendido").length,
    rechazados: baseData.filter((r) => r.estado?.toLowerCase() === "rechazado").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isDocente ? "Mis Requerimientos" : "Requerimientos de Visitas"}
          </h1>
          <p className="text-muted-foreground">
            {isDocente
              ? "Requerimientos solicitados en las visitas a tus clases"
              : "Seguimiento de requerimientos solicitados durante las visitas inopinadas"
            }
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendientes}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> En Proceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.enProceso}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Atendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.atendidos}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
              <XCircle className="h-4 w-4" /> Rechazados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rechazados}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Requerimientos
          </CardTitle>
          <CardDescription>
            Gestione y de seguimiento a los requerimientos de las visitas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descripcion, docente o asignatura..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="en_proceso">En Proceso</SelectItem>
                <SelectItem value="atendido">Atendidos</SelectItem>
                <SelectItem value="rechazado">Rechazados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Descripcion</TableHead>
                  <TableHead>Visita / Docente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequerimientos.map((req) => {
                  const estadoKey = normalizeEstado(req.estado)
                  const config = estadoConfig[estadoKey] || estadoConfig.pendiente
                  const EstadoIcon = config.icon

                  return (
                    <TableRow key={req.id}>
                      <TableCell className="font-mono text-sm">{req.id}</TableCell>
                      <TableCell>
                        <p className="line-clamp-2 text-sm">{req.descripcion}</p>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{req.nombreDocente}</p>
                          <p className="text-muted-foreground">{req.nombreAsignatura}</p>
                          <p className="text-xs text-muted-foreground">{req.nombreSede}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {req.fechaSolicitud
                          ? new Date(req.fechaSolicitud).toLocaleDateString("es-PE")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={config.color}>
                          <EstadoIcon className="h-3 w-3 mr-1" />
                          {config.label}
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
                            <DropdownMenuItem onClick={() => handleOpenRequerimiento(req)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalle
                            </DropdownMenuItem>
                            {canRespond && (
                              <DropdownMenuItem onClick={() => handleOpenRequerimiento(req)}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Responder
                              </DropdownMenuItem>
                            )}
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

      <Dialog
        open={!!selectedReq}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedReq(null)
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Requerimiento #{selectedReq?.id}</DialogTitle>
            <DialogDescription>
              Visita #{selectedReq?.idVisita} - {selectedReq?.nombreSede}
            </DialogDescription>
          </DialogHeader>
          {selectedReq && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <Label className="text-xs text-muted-foreground">Descripcion del requerimiento:</Label>
                <p className="mt-1 text-sm">{selectedReq.descripcion}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Docente:</Label>
                  <p className="font-medium">{selectedReq.nombreDocente}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Asignatura:</Label>
                  <p className="font-medium">{selectedReq.nombreAsignatura}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Fecha solicitud:</Label>
                  <p className="font-medium">
                    {selectedReq.fechaSolicitud
                      ? new Date(selectedReq.fechaSolicitud).toLocaleDateString("es-PE")
                      : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Estado actual:</Label>
                  <Badge
                    variant="secondary"
                    className={
                      estadoConfig[normalizeEstado(selectedReq.estado)]?.color ||
                      estadoConfig.pendiente.color
                    }
                  >
                    {estadoConfig[normalizeEstado(selectedReq.estado)]?.label || "Pendiente"}
                  </Badge>
                </div>
              </div>

              {selectedReq.respuesta && (
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Respuesta:</Label>
                  <p className="mt-1 text-sm">{selectedReq.respuesta}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Respondido: {selectedReq.fechaRespuesta && new Date(selectedReq.fechaRespuesta).toLocaleDateString("es-PE")}
                  </p>
                </div>
              )}

              {canRespond && (
                <div className="space-y-3 border-t pt-4">
                  <Label>Actualizar estado y respuesta:</Label>
                  <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nuevo estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="en_proceso">En Proceso</SelectItem>
                      <SelectItem value="atendido">Atendido</SelectItem>
                      <SelectItem value="rechazado">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Escriba la respuesta o comentario..."
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    rows={3}
                  />
                  {!respuesta.trim() && (
                    <p className="text-sm text-red-600">Por favor completa el campo de respuesta antes de guardar.</p>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReq(null)}>
              Cancelar
            </Button>
            {canRespond && (
              <Button disabled={isResponderDisabled} onClick={handleResponder}>
                Guardar Respuesta
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
