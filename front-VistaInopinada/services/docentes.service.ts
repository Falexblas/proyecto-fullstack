import api from "@/lib/api"

export interface Docente {
  id: number
  nombres: string
  apellidos: string
  email: string
  estadoActivo: boolean
}

export const docentesService = {
  getAll: async (): Promise<Docente[]> => {
    const response = await api.get<Docente[]>("/docentes")
    return response.data
  },

  getActivos: async (): Promise<Docente[]> => {
    const response = await api.get<Docente[]>("/docentes/activos")
    return response.data
  },

  getById: async (id: number): Promise<Docente> => {
    const response = await api.get<Docente>(`/docentes/${id}`)
    return response.data
  },
}
