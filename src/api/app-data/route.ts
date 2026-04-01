export async function GET() {
  return Response.json({
    userName: 'demo-user',
    authorities: ['USER', 'ADMIN'],
  })
}