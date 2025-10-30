import { getMQTTBroker } from "./mqtt-simulator"
import { getSensorTopic } from "./mqtt-topics"
import type { Sensor, SensorData } from "@/types/database"

export class MQTTSensorBridge {
  private broker = getMQTTBroker()
  private publishInterval: NodeJS.Timeout | null = null

  startPublishing(sensors: Sensor[], interval = 2000): void {
    if (this.publishInterval) {
      clearInterval(this.publishInterval)
    }

    this.publishInterval = setInterval(() => {
      sensors.forEach((sensor) => {
        if (sensor.protocol === "mqtt" && sensor.status === "active") {
          const value = this.generateSensorValue(sensor)
          const topic = getSensorTopic(sensor.id, "data")

          this.broker.publish(topic, {
            sensor_id: sensor.id,
            sensor_name: sensor.name,
            value,
            unit: sensor.unit,
            timestamp: new Date().toISOString(),
          })
        }
      })
    }, interval)
  }

  stopPublishing(): void {
    if (this.publishInterval) {
      clearInterval(this.publishInterval)
      this.publishInterval = null
    }
  }

  subscribeSensorData(callback: (data: SensorData & { sensor: Sensor }) => void): void {
    this.broker.subscribe("iot/sensors/+/data", (message) => {
      const payload = message.payload
      callback({
        id: Date.now(),
        sensor_id: payload.sensor_id,
        value: payload.value,
        timestamp: payload.timestamp,
        metadata: null,
        sensor: {
          id: payload.sensor_id,
          name: payload.sensor_name,
          type: "temperature",
          unit: payload.unit,
          location: null,
          protocol: "mqtt",
          status: "active",
          min_threshold: null,
          max_threshold: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      })
    })
  }

  private generateSensorValue(sensor: Sensor): number {
    switch (sensor.type) {
      case "temperature":
        return Math.random() * 15 + 20 // 20-35°C
      case "humidity":
        return Math.random() * 40 + 40 // 40-80%
      case "pressure":
        return Math.random() * 40 + 990 // 990-1030 hPa
      case "motion":
        return Math.random() > 0.7 ? 1 : 0
      case "light":
        return Math.random() * 800 + 200 // 200-1000 lux
      default:
        return Math.random() * 100
    }
  }
}
