import { ofetch } from 'ofetch'
import type { UiPermissions } from '../model/UiPermissions'

export async function fetchUiPermissions(): Promise<UiPermissions> {
  return ofetch<UiPermissions>('/api/ui-permissions', {
    method: 'GET',
    credentials: 'include',
  })
}