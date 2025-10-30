import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env")
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the client across hot reloads
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("iot-platform")
}

// Collection names
export const COLLECTIONS = {
  SENSORS: "sensors",
  SENSOR_DATA: "sensor_data", // Time-series collection
  ACTUATORS: "actuators",
  ACTUATOR_DATA: "actuator_data", // Time-series collection
  NOTIFICATIONS: "notifications",
  API_KEYS: "api_keys",
} as const
