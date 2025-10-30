// import type { ObjectId } from "mongodb"

// export interface Sensor {
//   _id?: ObjectId
//   id: string
//   name: string
//   type: "temperature" | "humidity" | "pressure" | "motion" | "light" | "gas"
//   unit: string
//   location: string
//   protocol: "mqtt" | "http" | "virtual"
//   status: "active" | "inactive" | "error"
//   min_value?: number
//   max_value?: number
//   threshold_min?: number
//   threshold_max?: number
//   created_at: Date
//   updated_at: Date
//   user_id?: string
// }

// export interface SensorData {
//   _id?: ObjectId
//   sensor_id: string
//   value: number
//   unit: string
//   timestamp: Date
//   metadata?: {
//     location?: string
//     protocol?: string
//     [key: string]: any
//   }
// }

// export interface Actuator {
//   _id?: ObjectId
//   id: string
//   name: string
//   type: "switch" | "motor" | "valve" | "relay" | "servo"
//   location: string
//   protocol: "mqtt" | "http" | "virtual"
//   status: "active" | "inactive" | "error"
//   state: boolean
//   created_at: Date
//   updated_at: Date
//   user_id?: string
// }

// export interface ActuatorData {
//   _id?: ObjectId
//   actuator_id: string
//   state: boolean
//   command: string
//   timestamp: Date
//   metadata?: {
//     location?: string
//     protocol?: string
//     user_id?: string
//     [key: string]: any
//   }
// }

// export interface Notification {
//   _id?: ObjectId
//   id: string
//   sensor_id: string
//   sensor_name: string
//   message: string
//   severity: "info" | "warning" | "critical"
//   value: number
//   threshold: number
//   is_read: boolean
//   created_at: Date
//   user_id?: string
// }

// export interface ApiKey {
//   _id?: ObjectId
//   key: string
//   name: string
//   permissions: string[]
//   created_at: Date
//   last_used?: Date
//   user_id?: string
// }
