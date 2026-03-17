import type { SupabaseClient } from '@supabase/supabase-js';
import { failCategories } from '@constants/fail-categories';

export type TCreateFailPayload = {
  title: string;
  description: string;
  categoryIds: string[];
  author: string;
  url: string;
  date: string;
};

export async function getFails(supabase: SupabaseClient): Promise<IFailItem[]> {
  const { data, error } = await supabase.from('fails').select('*').order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as IFailItem[];
}

export async function createFail(supabase: SupabaseClient, body: TCreateFailPayload): Promise<IFailItem> {
  const categories = failCategories.filter((category) => body.categoryIds.includes(category.id));

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
    throw new Error(error.message);
  }

  return data as IFailItem;
}
