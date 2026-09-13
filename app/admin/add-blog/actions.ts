'use server';

import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function createBlog(formData: FormData) {
  const admin = await isAdmin();
  if (!admin) return { error: 'Not authorized' };

  const supabase = await createClient();

  const title = (formData.get('title') as string)?.trim();
  const category = (formData.get('category') as string)?.trim();
  const excerpt = (formData.get('excerpt') as string)?.trim();
  const content = formData.get('content') as string;
  const cover_image = (formData.get('cover_image') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim();
  if (!slug) slug = slugify(title);

  if (!title || !content) {
    return { error: 'Title aur content zaroori hain' };
  }

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from('blogs').insert({
    title,
    slug,
    excerpt,
    content,
    cover_image,
    category,
    author_id: user?.id,
    published: true,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath(`/blog/${slug}`);
  redirect('/admin');
}