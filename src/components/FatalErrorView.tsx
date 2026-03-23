'use client'

type Props = {
  message: string
}

export function FatalErrorView({ message }: Props) {
  return (
    <main>
      <h1>継続不能なエラーが発生しました</h1>
      <p>{message}</p>
    </main>
  )
}
