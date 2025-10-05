import { ZodSchema } from 'zod'

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return Response.json(data, { status: 200, ...(init || {}) })
}

export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return Response.json({ error: message, ...(extra || {}) }, { status })
}

export async function parseJson<T>(request: Request, schema: ZodSchema<T>) {
  const body = await request.json()
  return schema.parse(body)
}
