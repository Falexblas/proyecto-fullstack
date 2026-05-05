import api from "@/lib/api"

export interface Responsable {
  id: number
  nombres: string
  apellidos: string
  email: string | null
  telefono: string | null
  estadoActivo: boolean
}

export const responsablesService = {
  getAll: async (): Promise<Responsable[]> => {
    const response = await api.get<Responsable[]>("/responsables")
    return response.data
  },

  getActivos: async (): Promise<Responsable[]> => {
    const response = await api.get<Responsable[]>("/responsables/activos")
    return response.data
  },

  getById: async (id: number): Promise<Responsable> => {
    const response = await api.get<Responsable>(`/responsables/${id}`)
    return response.data
  },
}
