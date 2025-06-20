import { NextRequest, NextResponse } from 'next/server'
import { JobStore } from '@/lib/store'

export async function GET() {
  // Return array of all jobs
  const jobs = Array.from(JobStore.values())
  return NextResponse.json({ jobs, count: jobs.length })
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Job id required' }, { status: 400 })
  }
  const existed = JobStore.delete(id)
  return NextResponse.json({ success: existed, id })
} 