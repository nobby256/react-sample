import { http, HttpResponse, delay } from 'msw'

export const handlers = [
  http.get('/api/profile', () => {
    //return errorResponse(500, 'INTERNAL SERVER ERROR')
    return HttpResponse.json({
      userId: 'user-001',
      userName: 'demo-user',
      tenantId: 'tenant-001',
    })
  }),

  http.get('/api/app-data',  async () => {
    //return errorResponse(500, 'INTERNAL SERVER ERROR')
    await delay(2000) // 2秒の遅延をシミュレート

    return HttpResponse.json({
      masterA: ['A001', 'A002', 'A003'],
      masterB: [
        { code: 'B001', name: 'マスタB-1' },
        { code: 'B002', name: 'マスタB-2' },
      ],
    })
  }),

  http.get('/api/detail/:id', ({ params }) => {
    return errorResponse(500, 'INTERNAL SERVER ERROR')
    const id = String(params.id)

    return HttpResponse.json({
      id,
      name: `detail-${id}`,
    })
  }),

  http.put('/api/detail/:id', async ({ params, request }) => {
    //return errorResponse(500, 'INTERNAL SERVER ERROR')
    const id = String(params.id)
    const body = (await request.json()) as { name?: string }

    return HttpResponse.json({
      id,
      name: body.name ?? `updated-detail-${id}`,
    })
  }),

  http.get('/api/results', ({ request }) => {
    //return errorResponse(500, 'INTERNAL SERVER ERROR')
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword') ?? ''
    const category = url.searchParams.get('category') ?? ''

    return HttpResponse.json([
      {
        id: '1',
        name: `${keyword || 'サンプル'}-${category || 'all'}-1`,
      },
      {
        id: '2',
        name: `${keyword || 'サンプル'}-${category || 'all'}-2`,
      },
    ])
  }),

  http.get('/api/ui-permissions', () => {
    //return errorResponse(500, 'INTERNAL SERVER ERROR')
    return HttpResponse.json({
      screens: ['top', 'detail.view', 'report.list'],
      actions: ['detail.update', 'detail.delete', 'report.export'],
    })
  }),
]

function errorResponse(status: number, message: string) {
  return HttpResponse.json({ error: message }, { status })
}
