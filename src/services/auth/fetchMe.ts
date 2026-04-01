import { $api } from '@/lib/http/apiClient'

export type Me = {
  userId: string
  userName: string
  authorities: string[]
}

export async function fetchMe(): Promise<Me> {
  return $api<Me>('/api/me')
}