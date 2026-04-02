
export class AppError extends Error {
  status: number
  fatal: boolean

  constructor(status: number=500, message: string) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.fatal = status === 401 || status === 403 ? true :false
  }
}
