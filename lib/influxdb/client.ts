import { InfluxDB, Point, type WriteApi, type QueryApi } from "@influxdata/influxdb-client"

let writeApi: WriteApi | null = null
let queryApi: QueryApi | null = null

export function getInfluxDBClient() {
  const url = process.env.INFLUXDB_URL || "http://localhost:8086"
  const token = process.env.INFLUXDB_TOKEN || ""
  const org = process.env.INFLUXDB_ORG || "iot-platform"
  const bucket = process.env.INFLUXDB_BUCKET || "sensor-data"

  const client = new InfluxDB({ url, token })

  writeApi = client.getWriteApi(org, bucket, "ms")
  writeApi.useDefaultTags({ app: "iot-platform" })

  if (!queryApi) {
    queryApi = client.getQueryApi(org)
  }

  return { writeApi, queryApi, bucket, org }
}

export function createSensorDataPoint(
  sensorId: string,
  sensorType: string,
  value: number,
  location?: string,
  protocol?: string,
): Point {
  const point = new Point("sensor_reading")
    .tag("sensor_id", sensorId)
    .tag("sensor_type", sensorType)
    .floatField("value", value)

  if (location) point.tag("location", location)
  if (protocol) point.tag("protocol", protocol)

  return point
}

export function createActuatorStatePoint(
  actuatorId: string,
  actuatorType: string,
  state: boolean,
  value: number,
  location?: string,
  protocol?: string,
): Point {
  const point = new Point("actuator_state")
    .tag("actuator_id", actuatorId)
    .tag("actuator_type", actuatorType)
    .booleanField("state", state)
    .floatField("value", value)

  if (location) point.tag("location", location)
  if (protocol) point.tag("protocol", protocol)

  return point
}
