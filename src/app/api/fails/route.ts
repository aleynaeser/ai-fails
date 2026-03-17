import { NextResponse } from 'next/server';
import { createClient } from '@lib/supabase/server';
import { createFail, getFails, type TCreateFailPayload } from '@lib/supabase/fails';

export async function GET() {
  try {
    const supabase = await createClient();
    const data = await getFails(supabase);

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load fails';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = (await request.json()) as TCreateFailPayload;
    const data = await createFail(supabase, body);

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create fail';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

