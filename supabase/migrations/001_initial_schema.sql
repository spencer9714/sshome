-- ============================================================
-- SSHome Staging - Initial Database Schema
-- ============================================================

-- 0) Helper: updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- A) PROFILES
-- ============================================================
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'viewer',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- B) PROJECTS
-- ============================================================
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  city text NOT NULL,
  state text NOT NULL DEFAULT 'CA',
  property_type text NOT NULL,
  bedrooms int,
  bathrooms numeric,
  style_tags text[] NOT NULL DEFAULT '{}',
  budget_range text,
  goal text,
  summary text,
  what_we_did text,
  design_notes text,
  timeline_weeks int,
  cover_image_path text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-set published_at when publishing
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = true AND (OLD.is_published = false OR OLD.is_published IS NULL) THEN
    NEW.published_at = now();
  END IF;
  IF NEW.is_published = false THEN
    NEW.published_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_published_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_published_at();

-- ============================================================
-- C) PROJECT IMAGES
-- ============================================================
CREATE TABLE project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  path text NOT NULL,
  caption text,
  space text,
  sort_order int NOT NULL DEFAULT 0,
  is_before boolean NOT NULL DEFAULT false,
  is_after boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_images_project_sort
  ON project_images(project_id, sort_order);

-- ============================================================
-- D) LEADS
-- ============================================================
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,
  property_type text,
  bedrooms int,
  bathrooms numeric,
  current_status text,
  target_guests text[] DEFAULT '{}',
  style_preferences text[] DEFAULT '{}',
  timeline text,
  budget_furnishing_range text,
  budget_service_range text,
  scope text[] DEFAULT '{}',
  links text[] DEFAULT '{}',
  notes text,
  internal_status text NOT NULL DEFAULT 'new',
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  archived boolean NOT NULL DEFAULT false
);

CREATE INDEX idx_leads_status ON leads(internal_status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- ============================================================
-- E) RLS POLICIES
-- ============================================================

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  USING (is_admin());

-- Projects RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all projects"
  ON projects FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert projects"
  ON projects FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update projects"
  ON projects FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  USING (is_admin());

-- Project Images RLS
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view images of published projects"
  ON project_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_images.project_id
      AND projects.is_published = true
    )
  );

CREATE POLICY "Admins can view all project images"
  ON project_images FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert project images"
  ON project_images FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update project images"
  ON project_images FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete project images"
  ON project_images FOR DELETE
  USING (is_admin());

-- Leads RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update leads"
  ON leads FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete leads"
  ON leads FOR DELETE
  USING (is_admin());
