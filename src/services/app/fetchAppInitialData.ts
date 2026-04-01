import { $api } from '@/lib/http/apiClient'

export type AppInitialData = {
  userName: string
  authorities: string[]
}

export async function fetchAppInitialData(): Promise<AppInitialData> {
  return $api<AppInitialData>('/api/app-initial-data')
}