-- Insert sample users (passwords will be set through Supabase Auth)
INSERT INTO users (email, full_name, role) VALUES
  ('admin@iot-platform.com', 'System Administrator', 'admin'),
  ('operator@iot-platform.com', 'System Operator', 'operator'),
  ('viewer@iot-platform.com', 'System Viewer', 'viewer')
ON CONFLICT (email) DO NOTHING;

-- Insert sample sensors
INSERT INTO sensors (name, type, unit, location, protocol, min_threshold, max_threshold) VALUES
  ('Temperature Sensor 1', 'temperature', '°C', 'Room A', 'mqtt', 15, 30),
  ('Temperature Sensor 2', 'temperature', '°C', 'Room B', 'http', 15, 30),
  ('Humidity Sensor', 'humidity', '%', 'Room A', 'mqtt', 30, 70),
  ('Pressure Sensor', 'pressure', 'hPa', 'Outdoor', 'virtual', 980, 1020),
  ('Motion Sensor', 'motion', 'boolean', 'Entrance', 'mqtt', 0, 1),
  ('Light Sensor', 'light', 'lux', 'Room B', 'http', 0, 1000)
ON CONFLICT DO NOTHING;

-- Insert sample actuators
INSERT INTO actuators (name, type, location, protocol, state, value) VALUES
  ('LED Light', 'switch', 'Room A', 'mqtt', false, 0),
  ('Cooling Fan', 'motor', 'Room A', 'mqtt', false, 0),
  ('Servo Motor', 'motor', 'Room B', 'http', false, 0),
  ('Water Valve', 'valve', 'Garden', 'virtual', false, 0)
ON CONFLICT DO NOTHING;
