import { api } from "./api"

export interface VaultItem {
    _id: string
    userId: string
    title: string
    username: string
    encryptedPassword: string
    url?: string
    notes?: string
    createdAt: string
    updatedAt: string
}

export interface VaultItemInput {
    title: string
    username: string
    encryptedPassword: string
    url?: string
    notes?: string
}

export interface VaultResponse {
    items: VaultItem[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

export const vaultService = {
    async getItems(page = 1, limit = 10, search = ""): Promise<VaultResponse> {
        const response = await api.get<VaultResponse>("/vault", {
            params: { page, limit, search },
        })
        return response.data
    },

    async getItem(id: string): Promise<VaultItem> {
        const response = await api.get<{ item: VaultItem }>(`/vault/${id}`)
        return response.data.item
    },

    async createItem(item: VaultItemInput): Promise<VaultItem> {
        const response = await api.post<{ item: VaultItem }>("/vault", item)
        return response.data.item
    },

    async updateItem(id: string, item: VaultItemInput): Promise<VaultItem> {
        const response = await api.put<{ item: VaultItem }>(`/vault/${id}`, item)
        return response.data.item
    },

    async deleteItem(id: string): Promise<void> {
        await api.delete(`/vault/${id}`)
    },
}
