import { usePermissions } from '../filters/PermissionProvider'

export function useHasActionPermission(action: string): boolean {
  const { isLoading, hasAction } = usePermissions()

  if (isLoading) {
    return false
  }

  return hasAction(action)
}