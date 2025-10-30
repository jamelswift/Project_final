export const MQTT_TOPICS = {
  // Sensor topics
  SENSOR_DATA: "iot/sensors/+/data",
  SENSOR_STATUS: "iot/sensors/+/status",
  SENSOR_TEMPERATURE: "iot/sensors/temperature/+",
  SENSOR_HUMIDITY: "iot/sensors/humidity/+",
  SENSOR_PRESSURE: "iot/sensors/pressure/+",
  SENSOR_MOTION: "iot/sensors/motion/+",

  // Actuator topics
  ACTUATOR_COMMAND: "iot/actuators/+/command",
  ACTUATOR_STATE: "iot/actuators/+/state",
  ACTUATOR_STATUS: "iot/actuators/+/status",

  // System topics
  SYSTEM_ALERT: "iot/system/alert",
  SYSTEM_STATUS: "iot/system/status",
} as const

export function getSensorTopic(sensorId: string, type: "data" | "status" = "data"): string {
  return `iot/sensors/${sensorId}/${type}`
}

export function getActuatorTopic(actuatorId: string, type: "command" | "state" | "status" = "command"): string {
  return `iot/actuators/${actuatorId}/${type}`
}

export function parseSensorTopic(topic: string): { sensorId: string; type: string } | null {
  const match = topic.match(/^iot\/sensors\/([^/]+)\/([^/]+)$/)
  if (!match) return null
  return { sensorId: match[1], type: match[2] }
}

export function parseActuatorTopic(topic: string): { actuatorId: string; type: string } | null {
  const match = topic.match(/^iot\/actuators\/([^/]+)\/([^/]+)$/)
  if (!match) return null
  return { actuatorId: match[1], type: match[2] }
}
