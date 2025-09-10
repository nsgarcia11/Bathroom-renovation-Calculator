-- Enable Row Level Security
-- Note: JWT secret is automatically managed by Supabase

-- Create contractors table
CREATE TABLE contractors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  province TEXT NOT NULL,
  tax_rate DECIMAL(5,4) NOT NULL DEFAULT 0.13,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure only one contractor record per user
  UNIQUE(user_id)
);

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  project_name TEXT NOT NULL,
  project_address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workflow screens table
CREATE TABLE workflow_screens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  screen_type TEXT NOT NULL, -- 'demolition', 'shower_walls', 'shower_base', 'floors', 'finishings'
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create line items table
CREATE TABLE line_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_screen_id UUID REFERENCES workflow_screens(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'labor', 'material'
  name TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10,2) DEFAULT 0,
  unit TEXT DEFAULT 'ea',
  rate DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own contractors" ON contractors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contractors" ON contractors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contractors" ON contractors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own workflow screens" ON workflow_screens
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

CREATE POLICY "Users can insert own workflow screens" ON workflow_screens
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

CREATE POLICY "Users can update own workflow screens" ON workflow_screens
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

CREATE POLICY "Users can delete own workflow screens" ON workflow_screens
  FOR DELETE USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

CREATE POLICY "Users can view own line items" ON line_items
  FOR SELECT USING (auth.uid() = (SELECT p.user_id FROM projects p JOIN workflow_screens ws ON p.id = ws.project_id WHERE ws.id = workflow_screen_id));

CREATE POLICY "Users can insert own line items" ON line_items
  FOR INSERT WITH CHECK (auth.uid() = (SELECT p.user_id FROM projects p JOIN workflow_screens ws ON p.id = ws.project_id WHERE ws.id = workflow_screen_id));

CREATE POLICY "Users can update own line items" ON line_items
  FOR UPDATE USING (auth.uid() = (SELECT p.user_id FROM projects p JOIN workflow_screens ws ON p.id = ws.project_id WHERE ws.id = workflow_screen_id));

CREATE POLICY "Users can delete own line items" ON line_items
  FOR DELETE USING (auth.uid() = (SELECT p.user_id FROM projects p JOIN workflow_screens ws ON p.id = ws.project_id WHERE ws.id = workflow_screen_id));

CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_contractors_user_id ON contractors(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_workflow_screens_project_id ON workflow_screens(project_id);
CREATE INDEX idx_line_items_workflow_screen_id ON line_items(workflow_screen_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
