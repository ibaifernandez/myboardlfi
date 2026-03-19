-- ============================================================
-- MyBoardLFi — Schema inicial Phase 1
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- ── Tabla: organizations ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.organizations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  plan          TEXT NOT NULL DEFAULT 'free',   -- 'free' | 'pro'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Tabla: users (perfil público, vinculado a auth.users) ─────
CREATE TABLE IF NOT EXISTS public.users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'colaborador',
  -- roles: superadmin | admin | colaborador | cliente | guest
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── RLS: users ───────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios ven su propio perfil"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins ven todos los usuarios de su org"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'superadmin')
        AND u.organization_id = users.organization_id
    )
  );

-- ── Tabla: boards ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.boards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  color           TEXT,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  owner_id        UUID REFERENCES public.users(id) ON DELETE SET NULL,
  position        INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven tableros de su org"
  ON public.boards FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

-- ── Tabla: columns ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.columns (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id   UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0,
  color      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.columns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven columnas de sus tableros"
  ON public.columns FOR SELECT
  USING (
    board_id IN (
      SELECT b.id FROM public.boards b
      JOIN public.users u ON u.organization_id = b.organization_id
      WHERE u.id = auth.uid()
    )
  );

-- ── Tabla: cards ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id       UUID NOT NULL REFERENCES public.columns(id) ON DELETE CASCADE,
  board_id        UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  priority        TEXT DEFAULT 'none',   -- none | low | medium | high
  due_date        DATE,
  category_id     TEXT,
  checklist       JSONB DEFAULT '[]',
  attachments     JSONB DEFAULT '[]',
  position        INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven tarjetas de su org"
  ON public.cards FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

-- ── Tabla: categories ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  label           TEXT NOT NULL,
  color_id        TEXT NOT NULL DEFAULT 'blue',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven categorías de su org"
  ON public.categories FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.users WHERE id = auth.uid()
    )
  );

-- ── Organización LFi de demo ──────────────────────────────────
INSERT INTO public.organizations (id, name, slug, plan)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'LFi Agency',
  'lfi',
  'pro'
) ON CONFLICT DO NOTHING;
