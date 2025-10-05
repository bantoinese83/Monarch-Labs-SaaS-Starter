import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const secret = searchParams.get('secret')

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 })
  }

  if (!path) {
    return Response.json({ message: 'Missing path' }, { status: 400 })
  }

  try {
    revalidatePath(path)
    return Response.json({ revalidated: true })
  } catch {
    return Response.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
