import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/app-data', () => {
    return HttpResponse.json({
      userName: 'demo-user',
      authorities: ['USER', 'ADMIN'],
    })
  }),

  http.get('/api/detail/:id', ({ params }) => {
    const id = String(params.id)

    return HttpResponse.json({
      id,
      name: `detail-${id}`,
    })
  }),

  http.put('/api/detail/:id', async ({ params, request }) => {
    const id = String(params.id)
    const body = (await request.json()) as { name?: string }

    return HttpResponse.json({
      id,
      name: body.name ?? `updated-detail-${id}`,
    })
  }),

  http.get('/api/me', () => {
    return HttpResponse.json({
      userId: 'u-001',
      userName: 'demo-user',
      authorities: ['USER', 'REPORT_VIEW'],
    })
  }),

  http.get('/api/results', ({ request }) => {
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
    return HttpResponse.json({
      screens: ['top', 'detail.view', 'report.list'],
      actions: ['detail.update', 'detail.delete', 'report.export'],
    })
  }),
]
