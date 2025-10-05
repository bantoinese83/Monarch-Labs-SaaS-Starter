import { SignJWT, jwtVerify } from 'jose'

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set in environment variables')
  throw new Error('JWT_SECRET is not set')
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  email: string
  teamId?: string
  role?: string
  [key: string]: unknown
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch {
    return null
  }
}
