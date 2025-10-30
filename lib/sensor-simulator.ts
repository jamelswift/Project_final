import type { SensorData, SensorType, SensorReading } from "@/types/sensor"

export class SensorSimulator {
  private sensors: Map<string, SensorData> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private history: Map<string, SensorReading[]> = new Map()

  constructor() {
    this.initializeSensors()
  }

  private initializeSensors() {
    const defaultSensors: SensorData[] = [
      {
        id: "temp-01",
        name: "Temperature Sensor 1",
        type: "temperature",
        value: 22.5,
        unit: "°C",
        status: "online",
        lastUpdate: new Date(),
      },
      {
        id: "temp-02",
        name: "Temperature Sensor 2",
        type: "temperature",
        value: 24.0,
        unit: "°C",
        status: "online",
        lastUpdate: new Date(),
      },
      {
        id: "humid-01",
        name: "Humidity Sensor 1",
        type: "humidity",
        value: 65,
        unit: "%",
        status: "online",
        lastUpdate: new Date(),
      },
      {
        id: "press-01",
        name: "Pressure Sensor 1",
        type: "pressure",
        value: 1013.25,
        unit: "hPa",
        status: "online",
        lastUpdate: new Date(),
      },
      {
        id: "motion-01",
        name: "Motion Sensor 1",
        type: "motion",
        value: 0,
        unit: "detected",
        status: "online",
        lastUpdate: new Date(),
      },
    ]

    defaultSensors.forEach((sensor) => {
      this.sensors.set(sensor.id, sensor)
      this.history.set(sensor.id, [])
    })
  }

  private generateValue(type: SensorType, currentValue: number): number {
    const ranges = {
      temperature: { min: 18, max: 30, variance: 0.5 },
      humidity: { min: 40, max: 80, variance: 2 },
      pressure: { min: 980, max: 1040, variance: 1 },
      motion: { min: 0, max: 1, variance: 1 },
    }

    const range = ranges[type]
    const change = (Math.random() - 0.5) * range.variance
    let newValue = currentValue + change

    if (type === "motion") {
      return Math.random() > 0.9 ? 1 : 0
    }

    newValue = Math.max(range.min, Math.min(range.max, newValue))
    return Math.round(newValue * 100) / 100
  }

  startSimulation(callback: (sensors: SensorData[]) => void) {
    this.sensors.forEach((sensor) => {
      const interval = setInterval(() => {
        const newValue = this.generateValue(sensor.type, sensor.value)
        sensor.value = newValue
        sensor.lastUpdate = new Date()

        // Update history
        const sensorHistory = this.history.get(sensor.id) || []
        sensorHistory.push({
          timestamp: new Date(),
          value: newValue,
        })

        // Keep only last 50 readings
        if (sensorHistory.length > 50) {
          sensorHistory.shift()
        }
        this.history.set(sensor.id, sensorHistory)

        callback(Array.from(this.sensors.values()))
      }, 2000)

      this.intervals.set(sensor.id, interval)
    })
  }

  stopSimulation() {
    this.intervals.forEach((interval) => clearInterval(interval))
    this.intervals.clear()
  }

  getSensors(): SensorData[] {
    return Array.from(this.sensors.values())
  }

  getHistory(sensorId: string): SensorReading[] {
    return this.history.get(sensorId) || []
  }

  toggleSensorStatus(sensorId: string) {
    const sensor = this.sensors.get(sensorId)
    if (sensor) {
      sensor.status = sensor.status === "online" ? "offline" : "online"
    }
  }
}
