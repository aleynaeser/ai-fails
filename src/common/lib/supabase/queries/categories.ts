import type { SupabaseClient } from '@supabase/supabase-js';
import { MOCK_CATEGORIES } from '../mock-data';

export type TCreateFailCategoryPayload = {
  name: string;
};

export async function getCategories(supabase: SupabaseClient): Promise<IFailCategory[]> {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });

    if (error) {
      console.warn('[getCategories] Supabase error, falling back to mock data:', error.message);
      return MOCK_CATEGORIES;
    }

    if (!data || data.length === 0) {
      console.warn('[getCategories] No data from Supabase, falling back to mock data');
      return MOCK_CATEGORIES;
    }

    return data as IFailCategory[];
  } catch (err) {
    console.warn('[getCategories] Supabase unreachable, falling back to mock data:', err);
    return MOCK_CATEGORIES;
  }
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
