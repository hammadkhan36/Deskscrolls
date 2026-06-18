// app/signup/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('') // optional extra field
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Signup with email + password, plus metadata (name)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName, // stored in raw_user_meta_data
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // If email confirmation is enabled, user will get an email.
    // If not, the user is immediately signed in but may need to be redirected.
    if (data.user && data.session) {
      // Immediately signed in (confirmation disabled)
      router.push('/admin') // or wherever you want
    } else {
      // Email confirmation required
      setMessage('Signup successful! Please check your email to confirm your account.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Create DeskScrolls Account</h1>

      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
      {message && <div className="bg-green-100 text-green-700 p-2 rounded mb-3">{message}</div>}

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name (optional)"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
          minLength={6}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 underline">
          Log in
        </Link>
      </p>
    </div>
  )
}





















// han bilkul auto create hoti ha new user sign up karna pa profiles table maan new row add ho jati ha


// SELECT proname, prosrc FROM pg_proc WHERE pronamespace = 'public'::regnamespace AND proname ILIKE '%user%' OR proname ILIKE '%profile%';

// is ka result ye hai:
// proname,prosrc
// handle_new_user,"
// begin
//   insert into public.profiles (id, full_name, avatar_url, role)
//   values (
//     new.id,
//     new.raw_user_meta_data ->> 'full_name',
//     new.raw_user_meta_data ->> 'avatar_url',
//     'author'               -- default role
//   );
//   return new;
// end;
// " ya dako




// SELECT tablename, policyname, cmd, permissive, roles, qual, with_check
// FROM pg_policies
// WHERE tablename = 'setups';

// is ka result ye hai:
// tablename,policyname,cmd,permissive,roles,qual,with_check
// setups,Admin full access setups,ALL,PERMISSIVE,{public},"(EXISTS ( SELECT 1
//    FROM profiles
//   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))",null
// setups,Admin sees all setups,SELECT,PERMISSIVE,{public},"(EXISTS ( SELECT 1
//    FROM profiles
//   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))",null
// setups,Authors insert setups,INSERT,PERMISSIVE,{public},null,(auth.uid() = author_id)
// setups,Authors see own setups,SELECT,PERMISSIVE,{public},(auth.uid() = author_id),null
// setups,Authors update own setups,UPDATE,PERMISSIVE,{public},(auth.uid() = author_id),(auth.uid() = author_id)
// setups,Published setups viewable by everyone,SELECT,PERMISSIVE,{public},(published = true),null




// nahi category_id  ab use nahi hota 
// create table public.setup_categories (
//   setup_id uuid not null,
//   category_id uuid not null,
//   constraint setup_categories_pkey primary key (setup_id, category_id),
//   constraint setup_categories_category_id_fkey foreign KEY (category_id) references categories (id) on delete CASCADE,
//   constraint setup_categories_setup_id_fkey foreign KEY (setup_id) references setups (id) on delete CASCADE
// ) TABLESPACE pg_default;

// ya table use hota ha 





// bilkul setups maan articles han wo public daak saka gi 
// sirf published = true aur deleted_at IS NULL wali rows hi public dekh sake.


// nahi maan na abi taak kisi ko admin nahi kia . admin karna ha abi author hi ha 



// baki tables 
// create table public.categories (
//   id uuid not null default extensions.uuid_generate_v4 (),
//   name text not null,
//   slug text not null,
//   description text null,
//   created_at timestamp with time zone null default now(),
//   constraint categories_pkey primary key (id),
//   constraint categories_name_key unique (name),
//   constraint categories_slug_key unique (slug)
// ) TABLESPACE pg_default;
// ya categories ka table ha is maan categories ka data store hota ha


// create table public.newsletter_subscribers (
//   id uuid not null default extensions.uuid_generate_v4 (),
//   email text not null,
//   name text null,
//   subscribed_at timestamp with time zone null default now(),
//   unsubscribed_at timestamp with time zone null,
//   status text null default 'active'::text,
//   constraint newsletter_subscribers_pkey primary key (id),
//   constraint newsletter_subscribers_email_key unique (email),
//   constraint newsletter_subscribers_status_check check (
//     (
//       status = any (array['active'::text, 'unsubscribed'::text])
//     )
//   )
// ) TABLESPACE pg_default;

// create index IF not exists idx_newsletter_email on public.newsletter_subscribers using btree (email) TABLESPACE pg_default;

// ya newsletter ka table ha jis maan public users ka email jo uno na khud subscribe kia tah wo aayin ga is maan 


// baki setups sa related tables ya han

// create table public.setup_images (
//   id uuid not null default extensions.uuid_generate_v4 (),
//   setup_id uuid not null,
//   image_url text not null,
//   alt_text text null,
//   sort_order integer null default 0,
//   created_at timestamp with time zone null default now(),
//   constraint setup_images_pkey primary key (id),
//   constraint setup_images_setup_id_fkey foreign KEY (setup_id) references setups (id) on delete CASCADE
// ) TABLESPACE pg_default;

// create index IF not exists idx_setup_images_setup on public.setup_images using btree (setup_id, sort_order) TABLESPACE pg_default;


// create table public.setup_tags (
//   setup_id uuid not null,
//   tag_id uuid not null,
//   constraint setup_tags_pkey primary key (setup_id, tag_id),
//   constraint setup_tags_setup_id_fkey foreign KEY (setup_id) references setups (id) on delete CASCADE,
//   constraint setup_tags_tag_id_fkey foreign KEY (tag_id) references tags (id) on delete CASCADE
// ) TABLESPACE pg_default;


// create table public.tags (
//   id uuid not null default extensions.uuid_generate_v4 (),
//   name text not null,
//   slug text not null,
//   created_at timestamp with time zone null default now(),
//   constraint tags_pkey primary key (id),
//   constraint tags_name_key unique (name),
//   constraint tags_slug_key unique (slug)
// ) TABLESPACE pg_default;


// or agar koi user apna desk setup submit karta ha tu us ka lia ya table ha 

// create table public.submissions (
//   id uuid not null default extensions.uuid_generate_v4 (),
//   email text not null,
//   name text not null,
//   twitter text null,
//   instagram text null,
//   photo_link text null,
//   description text null,
//   equipment text null,
//   consent boolean not null default false,
//   newsletter boolean null default false,
//   status text null default 'pending'::text,
//   created_at timestamp with time zone null default now(),
//   social_profiles jsonb null default '[]'::jsonb,
//   image_urls jsonb null default '[]'::jsonb,
//   constraint submissions_pkey primary key (id),
//   constraint submissions_status_check check (
//     (
//       status = any (
//         array[
//           'pending'::text,
//           'approved'::text,
//           'rejected'::text
//         ]
//       )
//     )
//   )
// ) TABLESPACE pg_default;

