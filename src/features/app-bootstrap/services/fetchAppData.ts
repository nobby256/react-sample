import { $api } from '@/shared/http/apiClient'

export type AppInitialData = {
  userName: string
  authorities: string[]
}

export async function fetchAppData(): Promise<AppInitialData> {
  return $api<AppInitialData>('/api/app-data')
}