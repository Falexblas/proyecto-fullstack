import api from "@/lib/api"

export const usuarioService = {
  getMiFirma: async (): Promise<string> => {
    const response = await api.get<string>("/usuarios/mi-firma")
    return response.data
  },

  guardarMiFirma: async (firmaHash: string): Promise<string> => {
    const response = await api.post<string>("/usuarios/mi-firma", firmaHash, {
      headers: { "Content-Type": "text/plain" },
    })
    return response.data
  },
}
