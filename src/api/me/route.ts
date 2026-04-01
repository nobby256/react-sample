export async function GET() {
  return Response.json({
    userId: 'u-001',
    userName: 'demo-user',
    authorities: ['USER', 'REPORT_VIEW'],
  })
}