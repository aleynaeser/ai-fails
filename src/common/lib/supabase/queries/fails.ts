import type { SupabaseClient } from '@supabase/supabase-js';

export type TCreateFailPayload = {
  title: string;
  description: string;
  categories: IFailCategory[];
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
