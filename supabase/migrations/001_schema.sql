-- ============================================================
-- FurnishAI - Complete Database Schema
-- ============================================================

-- Helper: updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user',
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

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

-- ============================================================
-- PROVIDERS (furniture suppliers)
-- ============================================================
CREATE TABLE providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website text,
  logo_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- FURNITURE CATALOG
-- ============================================================
CREATE TABLE furniture_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers(id) ON DELETE SET NULL,
  name text NOT NULL,
  category text NOT NULL,
  width_cm int NOT NULL,
  depth_cm int NOT NULL,
  height_cm int,
  style_tags text[] NOT NULL DEFAULT '{}',
  price decimal(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  image_url text,
  product_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER furniture_items_updated_at
  BEFORE UPDATE ON furniture_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_furniture_category ON furniture_items(category);
CREATE INDEX idx_furniture_style_tags ON furniture_items USING GIN(style_tags);
CREATE INDEX idx_furniture_price ON furniture_items(price);

-- ============================================================
-- PROPERTIES (Airbnb homes)
-- ============================================================
CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_properties_user ON properties(user_id);

-- ============================================================
-- FLOORS
-- ============================================================
CREATE TABLE floors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  floor_number int NOT NULL DEFAULT 1,
  floor_plan_image_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_floors_property ON floors(property_id);

-- ============================================================
-- ROOMS
-- ============================================================
CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_id uuid NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
  name text NOT NULL,
  width_cm int NOT NULL,
  depth_cm int NOT NULL,
  position_x int NOT NULL DEFAULT 0,
  position_y int NOT NULL DEFAULT 0,
  -- doors: [{"x": 100, "y": 0, "width": 90, "wall": "top"}]
  doors jsonb NOT NULL DEFAULT '[]',
  -- windows: [{"x": 200, "y": 0, "width": 120, "wall": "right"}]
  windows jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_rooms_floor ON rooms(floor_id);

-- ============================================================
-- LAYOUT PLANS
-- ============================================================
CREATE TABLE layout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_id uuid NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
  name text NOT NULL,
  style_preferences text[] NOT NULL DEFAULT '{}',
  budget_limit decimal(10,2),
  currency text NOT NULL DEFAULT 'USD',
  total_price decimal(10,2),
  ai_reasoning text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_plans_floor ON layout_plans(floor_id);

-- ============================================================
-- PLAN ITEMS (furniture placement)
-- ============================================================
CREATE TABLE plan_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES layout_plans(id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  furniture_item_id uuid NOT NULL REFERENCES furniture_items(id) ON DELETE CASCADE,
  position_x int NOT NULL DEFAULT 0,
  position_y int NOT NULL DEFAULT 0,
  rotation int NOT NULL DEFAULT 0,  -- 0, 90, 180, 270
  quantity int NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_plan_items_plan ON plan_items(plan_id);
CREATE INDEX idx_plan_items_room ON plan_items(room_id);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins update profiles" ON profiles FOR UPDATE USING (is_admin());

-- Providers (public read, admin write)
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active providers" ON providers FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage providers" ON providers FOR ALL USING (is_admin());

-- Furniture items (public read, admin write)
ALTER TABLE furniture_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active furniture" ON furniture_items FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage furniture" ON furniture_items FOR ALL USING (is_admin());

-- Properties (owner only)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own properties" ON properties FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins view all properties" ON properties FOR SELECT USING (is_admin());

-- Floors (via property owner)
ALTER TABLE floors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Property owner manages floors" ON floors FOR ALL USING (
  EXISTS (SELECT 1 FROM properties WHERE properties.id = floors.property_id AND properties.user_id = auth.uid())
);
CREATE POLICY "Admins view all floors" ON floors FOR SELECT USING (is_admin());

-- Rooms (via property owner)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Property owner manages rooms" ON rooms FOR ALL USING (
  EXISTS (
    SELECT 1 FROM floors
    JOIN properties ON properties.id = floors.property_id
    WHERE floors.id = rooms.floor_id AND properties.user_id = auth.uid()
  )
);
CREATE POLICY "Admins view all rooms" ON rooms FOR SELECT USING (is_admin());

-- Layout plans (via property owner)
ALTER TABLE layout_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Property owner manages plans" ON layout_plans FOR ALL USING (
  EXISTS (
    SELECT 1 FROM floors
    JOIN properties ON properties.id = floors.property_id
    WHERE floors.id = layout_plans.floor_id AND properties.user_id = auth.uid()
  )
);
CREATE POLICY "Admins view all plans" ON layout_plans FOR SELECT USING (is_admin());

-- Plan items (via property owner)
ALTER TABLE plan_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Property owner manages plan items" ON plan_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM layout_plans
    JOIN floors ON floors.id = layout_plans.floor_id
    JOIN properties ON properties.id = floors.property_id
    WHERE layout_plans.id = plan_items.plan_id AND properties.user_id = auth.uid()
  )
);
CREATE POLICY "Admins view all plan items" ON plan_items FOR SELECT USING (is_admin());
