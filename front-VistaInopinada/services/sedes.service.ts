import api from "@/lib/api"

export interface Sede {
  id: number
  nombre: string
  direccion: string | null
  idUniversidad: number
}

export const sedesService = {
  getAll: async (): Promise<Sede[]> => {
    const response = await api.get<Sede[]>("/sedes")
    return response.data
  },

  getByUniversidad: async (idUniversidad: number): Promise<Sede[]> => {
    const response = await api.get<Sede[]>(`/sedes/universidad/${idUniversidad}`)
    return response.data
  },

  getById: async (id: number): Promise<Sede> => {
    const response = await api.get<Sede>(`/sedes/${id}`)
    return response.data
  },
}
