-- Create users table for authentication and access control
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'operator', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sensors table to store sensor configurations
CREATE TABLE IF NOT EXISTS sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('temperature', 'humidity', 'pressure', 'motion', 'light', 'air_quality')),
  unit TEXT NOT NULL,
  location TEXT,
  protocol TEXT NOT NULL DEFAULT 'mqtt' CHECK (protocol IN ('mqtt', 'http', 'virtual')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  min_threshold NUMERIC,
  max_threshold NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Removed sensor_data table - now stored in InfluxDB

-- Create actuators table to store actuator configurations
CREATE TABLE IF NOT EXISTS actuators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('switch', 'motor', 'valve', 'relay', 'dimmer')),
  location TEXT,
  protocol TEXT NOT NULL DEFAULT 'mqtt' CHECK (protocol IN ('mqtt', 'http', 'virtual')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  state BOOLEAN DEFAULT FALSE,
  value NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Removed actuator_logs table - now stored in InfluxDB

-- Create notifications table for threshold alerts
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id UUID REFERENCES sensors(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('threshold_exceeded', 'sensor_offline', 'system_alert')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create api_keys table for external API access
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_hash TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permissions JSONB NOT NULL DEFAULT '{"read": true, "write": false}',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE actuators ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Updated policies to remove sensor_data and actuator_logs references

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for sensors table
CREATE POLICY "Anyone authenticated can view sensors" ON sensors
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and operators can manage sensors" ON sensors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

-- Create policies for actuators table
CREATE POLICY "Anyone authenticated can view actuators" ON actuators
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and operators can control actuators" ON actuators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

-- Create policies for notifications table
CREATE POLICY "Users can view notifications" ON notifications
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);
