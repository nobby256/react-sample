import '@/shared/app-bootstrap/model/dataShape'

declare module '@/shared/app-bootstrap/model/dataShape' {
  interface ProfileData {
    userId: string
    userName: string
    tenantId: string
  }

  interface AppData {
    masterA: string[]
    masterB: Array<{
      code: string
      name: string
    }>
  }
}