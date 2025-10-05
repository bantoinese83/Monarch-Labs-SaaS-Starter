import { prisma } from '@/lib/db'

export async function GET() {
  try {
    ;(await prisma.$queryRaw`select 1`) as unknown
    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false }, { status: 500 })
  }
}
