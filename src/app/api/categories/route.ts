import { NextResponse } from 'next/server';
import { createClient } from '@lib/supabase/server';
import { createCategory, getCategories, type TCreateCategoryPayload } from '@lib/supabase/queries/categories';

export async function GET() {
  try {
    const supabase = await createClient();
    const data = await getCategories(supabase);

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load categories';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = (await request.json()) as TCreateCategoryPayload;
    const data = await createCategory(supabase, body);

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create category';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
