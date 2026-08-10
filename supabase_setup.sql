-- ============================================================
-- NITAQ AI Studio — Supabase Cloud Sync Setup
-- شغّل الكود ده مرة واحدة في: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1) الجدول اللي هيخزّن كل بيانات التطبيق (key-value)
create table if not exists public.nitaq_store (
  key         text primary key,
  value       jsonb,
  updated_at  timestamptz default now()
);

-- 2) تفعيل Row Level Security (مهم جداً للأمان)
alter table public.nitaq_store enable row level security;

-- 3) السياسات (Policies)
--    الوضع الحالي: مزامنة سحابية مشتركة — أي حد معاه الرابط يقدر يقرا/يكتب.
--    ده مناسب للاستخدام الخاص/الفريق الصغير. لو عايزة تسجيل دخول لكل مستخدم،
--    قوليلي وأعدّلها.

-- السماح بالقراءة
drop policy if exists "nitaq read" on public.nitaq_store;
create policy "nitaq read"
  on public.nitaq_store for select
  using (true);

-- السماح بالإضافة
drop policy if exists "nitaq insert" on public.nitaq_store;
create policy "nitaq insert"
  on public.nitaq_store for insert
  with check (true);

-- السماح بالتعديل
drop policy if exists "nitaq update" on public.nitaq_store;
create policy "nitaq update"
  on public.nitaq_store for update
  using (true) with check (true);

-- 4) (اختياري) تفعيل Realtime عشان التحديثات تظهر بين الأجهزة
alter publication supabase_realtime add table public.nitaq_store;
