export type SensorType = "temperature" | "humidity" | "pressure" | "motion"

export interface SensorData {
  id: string
  name: string
  type: SensorType
  value: number
  unit: string
  status: "online" | "offline" | "warning"
  lastUpdate: Date
}

export interface ActuatorData {
  id: string
  name: string
  type: "switch" | "motor" | "valve"
  state: boolean
  status: "online" | "offline"
  lastUpdate: Date
}

export interface SensorReading {
  timestamp: Date
  value: number
}
