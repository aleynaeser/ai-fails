import type { SupabaseClient } from '@supabase/supabase-js';
import { MOCK_FAILS } from './mock-data';

export type TCreateFailPayload = {
  title: string;
  description: string;
  categories: IFailCategory[];
  author: string;
  url: string;
  date: string;
};

export async function getFails(supabase: SupabaseClient): Promise<IFailItem[]> {
  try {
    const { data, error } = await supabase.from('fails').select('*').order('created_at', { ascending: false });

    if (error) {
      console.warn('[getFails] Supabase error, falling back to mock data:', error.message);
      return MOCK_FAILS;
    }

    if (!data || data.length === 0) {
      console.warn('[getFails] No data from Supabase, falling back to mock data');
      return MOCK_FAILS;
    }

    return data as IFailItem[];
  } catch (err) {
    console.warn('[getFails] Supabase unreachable, falling back to mock data:', err);
    return MOCK_FAILS;
  }
}

export async function createFail(supabase: SupabaseClient, body: TCreateFailPayload): Promise<IFailItem> {
  const categoryRows = body.categories
    .map((category) => ({
      id: category.id,
      name: category.name,
      created_at: category.created_at,
    }))
    .filter((category, index, self) => self.findIndex((item) => item.id === category.id) === index);

  if (!categoryRows.length) {
    throw new Error('At least one category is required');
  }

  const { data, error } = await supabase
    .from('fails')
    .insert({
      title: body.title,
      description: body.description,
      categories: categoryRows,
      author: body.author,
      url: body.url,
      date: body.date,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as IFailItem;
}
