import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const keyword = searchParams.get('keyword') ?? ''
  const category = searchParams.get('category') ?? ''

  return Response.json([
    {
      id: '1',
      name: `${keyword || 'サンプル'}-${category || 'all'}-1`,
    },
    {
      id: '2',
      name: `${keyword || 'サンプル'}-${category || 'all'}-2`,
    },
  ])
}