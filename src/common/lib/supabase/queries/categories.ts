import type { SupabaseClient } from '@supabase/supabase-js';

export type TCreateFailCategoryPayload = {
  name: string;
};

export async function getCategories(supabase: SupabaseClient): Promise<IFailCategory[]> {
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as IFailCategory[];
}

export async function createCategory(supabase: SupabaseClient, body: TCreateFailCategoryPayload): Promise<IFailCategory> {
  const name = body.name.trim().replace(/\s+/g, ' ');

  if (!name) {
    throw new Error('Category name is required');
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as IFailCategory;
}

export { createCategory as createFailCategory, getCategories as getFailCategories };
