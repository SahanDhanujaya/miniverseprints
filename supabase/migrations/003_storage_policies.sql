-- Storage policies for product/media uploads
-- Run in the Supabase SQL Editor after the main schema migration.

-- Public read access for the storefront assets in this bucket.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public can view miniverse_bucket objects'
  ) then
    create policy "Public can view miniverse_bucket objects"
    on storage.objects
    for select
    using (bucket_id = 'miniverse_bucket');
  end if;
end $$;

-- Only admins can upload files to the bucket.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can upload to miniverse_bucket'
  ) then
    create policy "Admins can upload to miniverse_bucket"
    on storage.objects
    for insert
    with check (
      bucket_id = 'miniverse_bucket'
      and exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role = 'admin'
      )
    );
  end if;
end $$;

-- Only admins can update or replace files in the bucket.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can update miniverse_bucket objects'
  ) then
    create policy "Admins can update miniverse_bucket objects"
    on storage.objects
    for update
    using (
      bucket_id = 'miniverse_bucket'
      and exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role = 'admin'
      )
    )
    with check (
      bucket_id = 'miniverse_bucket'
      and exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role = 'admin'
      )
    );
  end if;
end $$;

-- Only admins can delete files from the bucket.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can delete from miniverse_bucket'
  ) then
    create policy "Admins can delete from miniverse_bucket"
    on storage.objects
    for delete
    using (
      bucket_id = 'miniverse_bucket'
      and exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role = 'admin'
      )
    );
  end if;
end $$;
