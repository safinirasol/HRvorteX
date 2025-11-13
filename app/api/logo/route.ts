import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

async function tryRead(...candidates: string[]) {
  for (const p of candidates) {
    try {
      const data = await fs.readFile(p)
      return { data, filePath: p }
    } catch {}
  }
  return null
}

export async function GET() {
  const cwd = process.cwd()
  const candidates = [
    path.join(cwd, 'public', 'logosoft.png.jpg'),
    path.join(cwd, 'public', 'logosoft.png'),
    path.join(cwd, 'logosoft.png.jpg'),
    path.join(cwd, 'logosoft.png'),
    path.join(cwd, 'public', 'logo-fallback.svg'),
  ]

  const res = await tryRead(...candidates)
  if (!res) return NextResponse.json({ error: 'logo not found' }, { status: 404 })

  const ext = path.extname(res.filePath).toLowerCase()
  const type = ext === '.jpg' || ext === '.jpeg'
    ? 'image/jpeg'
    : ext === '.png'
    ? 'image/png'
    : 'image/svg+xml'

  return new NextResponse(res.data, { headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=3600' } })
}