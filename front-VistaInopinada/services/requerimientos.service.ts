import api from "@/lib/api"

export interface RequerimientoVisita {
  id: number
  idVisita: number
  descripcion: string
  fechaSolicitud: string
  estado: string
  respuesta?: string | null
  fechaRespuesta?: string | null
  nombreDocente?: string | null
  nombreAsignatura?: string | null
  nombreSede?: string | null
}

export interface RequerimientoUpdateRequest {
  estado: string
  respuesta: string
  fechaRespuesta?: string
}

export const requerimientosService = {
  listAll: async (): Promise<RequerimientoVisita[]> => {
    const response = await api.get<RequerimientoVisita[]>("/requerimientos")
    return response.data
  },

  getById: async (id: number): Promise<RequerimientoVisita> => {
    const response = await api.get<RequerimientoVisita>(`/requerimientos/${id}`)
    return response.data
  },

  update: async (id: number, payload: RequerimientoUpdateRequest): Promise<RequerimientoVisita> => {
    const response = await api.put<RequerimientoVisita>(`/requerimientos/${id}`, payload)
    return response.data
  },
}
