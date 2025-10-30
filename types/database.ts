export interface User {
  id: string
  email: string
  full_name: string | null
  role: "admin" | "operator" | "viewer"
  created_at: string
  updated_at: string
}

export interface Sensor {
  id: string
  name: string
  type: "temperature" | "humidity" | "pressure" | "motion" | "light" | "air_quality"
  unit: string
  location: string | null
  protocol: "mqtt" | "http" | "virtual"
  status: "active" | "inactive" | "error"
  min_threshold: number | null
  max_threshold: number | null
  created_at: string
  updated_at: string
}

export interface SensorData {
  id: number
  sensor_id: string
  value: number
  timestamp: string
  metadata: Record<string, any> | null
}

export interface Actuator {
  id: string
  name: string
  type: "switch" | "motor" | "valve" | "relay" | "dimmer"
  location: string | null
  protocol: "mqtt" | "http" | "virtual"
  status: "active" | "inactive" | "error"
  state: boolean
  value: number
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  sensor_id: string | null
  type: "threshold_exceeded" | "sensor_offline" | "system_alert"
  severity: "info" | "warning" | "critical"
  message: string
  is_read: boolean
  created_at: string
}
