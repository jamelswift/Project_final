import type { Sensor, SensorData, Notification } from "@/types/database"

export class ThresholdMonitor {
  private notificationCallbacks: Array<(notification: Notification) => void> = []

  checkThreshold(sensor: Sensor, data: SensorData): Notification | null {
    if (!sensor.min_threshold && !sensor.max_threshold) {
      return null
    }

    let violation: "min" | "max" | null = null
    let severity: "info" | "warning" | "critical" = "info"

    if (sensor.max_threshold && data.value > sensor.max_threshold) {
      violation = "max"
      const excess = ((data.value - sensor.max_threshold) / sensor.max_threshold) * 100
      severity = excess > 20 ? "critical" : excess > 10 ? "warning" : "info"
    } else if (sensor.min_threshold && data.value < sensor.min_threshold) {
      violation = "min"
      const deficit = ((sensor.min_threshold - data.value) / sensor.min_threshold) * 100
      severity = deficit > 20 ? "critical" : deficit > 10 ? "warning" : "info"
    }

    if (!violation) return null

    const notification: Notification = {
      id: crypto.randomUUID(),
      sensor_id: sensor.id,
      type: "threshold_exceeded",
      severity,
      message: `${sensor.name} ${violation === "max" ? "exceeded maximum" : "below minimum"} threshold: ${data.value.toFixed(2)}${sensor.unit} (${violation === "max" ? "max" : "min"}: ${violation === "max" ? sensor.max_threshold : sensor.min_threshold}${sensor.unit})`,
      is_read: false,
      created_at: new Date().toISOString(),
    }

    this.notificationCallbacks.forEach((callback) => callback(notification))

    return notification
  }

  onNotification(callback: (notification: Notification) => void): void {
    this.notificationCallbacks.push(callback)
  }

  clearCallbacks(): void {
    this.notificationCallbacks = []
  }
}
