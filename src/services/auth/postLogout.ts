import { $api } from '@/lib/http/apiClient'

export async function postLogout(): Promise<void> {
  await $api('/logout', {
    method: 'POST',
  })
}