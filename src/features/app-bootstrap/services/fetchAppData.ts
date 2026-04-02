import { $api } from '@/lib/http/apiClient'

export type AppInitialData = {
  userName: string
  authorities: string[]
}

export async function fetchAppData(): Promise<AppInitialData> {
  return $api<AppInitialData>('/api/app-data')
}