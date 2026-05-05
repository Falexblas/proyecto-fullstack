import api from "@/lib/api"

export interface Visita {
  id: number
  fechaVisita: string
  horaInicio: string
  horaTermino: string
  semanaNumero: number | null
  lugarVisita: string | null
  tipoClase: string
  idSede: number
  nombreSede: string
  idDocente: number
  nombreDocente: string
  apellidosDocente: string
  idAsignatura: number
  nombreAsignatura: string
  idResponsable: number
  nombreResponsable: string
  idUsuarioAuditor: number
  nombreAuditor: string
  estadoVisita: string
  firmaDocenteHash: string | null
  firmaResponsableHash: string | null
  fechaFirmaDocente: string | null
  fechaFirmaResponsable: string | null
  fechaRegistro: string
  updatedAt: string | null
}

export interface VisitaCreateData {
  fechaVisita: string
  horaInicio: string
  horaTermino: string
  semanaNumero?: number | null
  lugarVisita?: string | null
  tipoClase?: string
  idSede: number
  idDocente: number
  idAsignatura: number
  idResponsable: number
}

export const visitasService = {
  getAll: async (): Promise<Visita[]> => {
    const response = await api.get<Visita[]>("/visitas")
    return response.data
  },

  getMisVisitasDocente: async (): Promise<Visita[]> => {
    const response = await api.get<Visita[]>("/visitas/mis-visitas-docente")
    return response.data
  },

  getMisVisitasAuditor: async (): Promise<Visita[]> => {
    const response = await api.get<Visita[]>("/visitas/mis-visitas-auditor")
    return response.data
  },

  getById: async (id: number): Promise<Visita> => {
    const response = await api.get<Visita>(`/visitas/${id}`)
    return response.data
  },

  create: async (data: VisitaCreateData): Promise<Visita> => {
    const response = await api.post<Visita>("/visitas", data)
    return response.data
  },

  updateEvaluaciones: async (id: number, data: VisitaCreateData): Promise<Visita> => {
    const response = await api.put<Visita>(`/visitas/${id}/evaluaciones`, data)
    return response.data
  },

  firmarDocente: async (id: number, firmaHash: string): Promise<Visita> => {
    const response = await api.post<Visita>(`/visitas/${id}/firma-docente`, firmaHash, {
      headers: { "Content-Type": "text/plain" },
    })
    return response.data
  },

  firmarAuditor: async (id: number, firmaHash: string): Promise<Visita> => {
    const response = await api.post<Visita>(`/visitas/${id}/firma-auditor`, firmaHash, {
      headers: { "Content-Type": "text/plain" },
    })
    return response.data
  },
}
