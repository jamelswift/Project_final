import { getInfluxDBClient } from "./client"

export interface SensorReading {
  timestamp: string
  sensor_id: string
  sensor_type: string
  value: number
  location?: string
  protocol?: string
}

export interface ActuatorState {
  timestamp: string
  actuator_id: string
  actuator_type: string
  state: boolean
  value: number
  location?: string
  protocol?: string
}

export async function querySensorData(
  sensorId: string,
  startTime = "-1h",
  stopTime = "now()",
): Promise<SensorReading[]> {
  const { queryApi, bucket } = getInfluxDBClient()

  const query = `
    from(bucket: "${bucket}")
      |> range(start: ${startTime}, stop: ${stopTime})
      |> filter(fn: (r) => r._measurement == "sensor_reading")
      |> filter(fn: (r) => r.sensor_id == "${sensorId}")
      |> filter(fn: (r) => r._field == "value")
      |> sort(columns: ["_time"], desc: false)
  `

  const results: SensorReading[] = []

  return new Promise((resolve, reject) => {
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const record = tableMeta.toObject(row)
        results.push({
          timestamp: record._time,
          sensor_id: record.sensor_id,
          sensor_type: record.sensor_type,
          value: record._value,
          location: record.location,
          protocol: record.protocol,
        })
      },
      error(error) {
        console.error("[v0] InfluxDB query error:", error)
        reject(error)
      },
      complete() {
        resolve(results)
      },
    })
  })
}

export async function queryLatestSensorValue(sensorId: string): Promise<number | null> {
  const { queryApi, bucket } = getInfluxDBClient()

  const query = `
    from(bucket: "${bucket}")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "sensor_reading")
      |> filter(fn: (r) => r.sensor_id == "${sensorId}")
      |> filter(fn: (r) => r._field == "value")
      |> last()
  `

  return new Promise((resolve, reject) => {
    let latestValue: number | null = null

    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const record = tableMeta.toObject(row)
        latestValue = record._value
      },
      error(error) {
        console.error("[v0] InfluxDB query error:", error)
        reject(error)
      },
      complete() {
        resolve(latestValue)
      },
    })
  })
}

export async function queryActuatorHistory(
  actuatorId: string,
  startTime = "-24h",
  stopTime = "now()",
): Promise<ActuatorState[]> {
  const { queryApi, bucket } = getInfluxDBClient()

  const query = `
    from(bucket: "${bucket}")
      |> range(start: ${startTime}, stop: ${stopTime})
      |> filter(fn: (r) => r._measurement == "actuator_state")
      |> filter(fn: (r) => r.actuator_id == "${actuatorId}")
      |> sort(columns: ["_time"], desc: false)
  `

  const results: ActuatorState[] = []

  return new Promise((resolve, reject) => {
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const record = tableMeta.toObject(row)
        if (record._field === "state") {
          results.push({
            timestamp: record._time,
            actuator_id: record.actuator_id,
            actuator_type: record.actuator_type,
            state: record._value,
            value: 0, // Will be filled from value field
            location: record.location,
            protocol: record.protocol,
          })
        }
      },
      error(error) {
        console.error("[v0] InfluxDB query error:", error)
        reject(error)
      },
      complete() {
        resolve(results)
      },
    })
  })
}

export async function queryAggregatedSensorData(
  sensorId: string,
  aggregateWindow = "5m",
  startTime = "-1h",
): Promise<Array<{ timestamp: string; mean: number; min: number; max: number }>> {
  const { queryApi, bucket } = getInfluxDBClient()

  const query = `
    from(bucket: "${bucket}")
      |> range(start: ${startTime})
      |> filter(fn: (r) => r._measurement == "sensor_reading")
      |> filter(fn: (r) => r.sensor_id == "${sensorId}")
      |> filter(fn: (r) => r._field == "value")
      |> aggregateWindow(every: ${aggregateWindow}, fn: mean, createEmpty: false)
      |> yield(name: "mean")
  `

  const results: Array<{ timestamp: string; mean: number; min: number; max: number }> = []

  return new Promise((resolve, reject) => {
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const record = tableMeta.toObject(row)
        results.push({
          timestamp: record._time,
          mean: record._value,
          min: record._value, // Simplified for now
          max: record._value,
        })
      },
      error(error) {
        console.error("[v0] InfluxDB query error:", error)
        reject(error)
      },
      complete() {
        resolve(results)
      },
    })
  })
}
