import api from "@/lib/api"

export interface Asignatura {
  id: number
  nombre: string
  codigo: string | null
  creditos: number | null
  ciclo: string | null
  estadoActivo: boolean | null
}

export const asignaturasService = {
  getAll: async (): Promise<Asignatura[]> => {
    const response = await api.get<Asignatura[]>("/asignaturas")
    return response.data
  },

  getById: async (id: number): Promise<Asignatura> => {
    const response = await api.get<Asignatura>(`/asignaturas/${id}`)
    return response.data
  },
}
