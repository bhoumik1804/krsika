import { apiClient } from '@/lib/api-client'

export const registerMill = async (data: any) => {
    const response = await apiClient.post('/auth/register-mill', data)
    return response.data
}
