import { NextResponse } from 'next/server';
import { createClient } from '@lib/supabase/server';
import { failCategories } from '@constants/fail-categories';

type TCreateFailPayload = {
  title: string;
  description: string;
  categoryIds: string[];
  author: string;
  url: string;
   date: string;
};

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('fails').select('*').order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data satisfies IFailItem[]);
}

export async function POST(request: Request) {
  const body = (await request.json()) as TCreateFailPayload;

  const categories = failCategories.filter((c) => body.categoryIds.includes(c.id));

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('fails')
    .insert({
      title: body.title,
      description: body.description,
      categories,
      author: body.author,
      url: body.url,
      date: body.date,
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data satisfies IFailItem);
}

