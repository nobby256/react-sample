import type { NextRequest } from 'next/server'

type Context = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_: NextRequest, context: Context) {
  const { id } = await context.params

  return Response.json({
    id,
    name: `detail-${id}`,
  })
}

export async function PUT(request: NextRequest, context: Context) {
  const { id } = await context.params
  const body = (await request.json()) as { name?: string }

  return Response.json({
    id,
    name: body.name ?? `updated-detail-${id}`,
  })
}