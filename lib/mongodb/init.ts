import { getDatabase, COLLECTIONS } from "./client"

export async function initializeDatabase() {
  const db = await getDatabase()

  // Create time-series collection for sensor data
  try {
    await db.createCollection(COLLECTIONS.SENSOR_DATA, {
      timeseries: {
        timeField: "timestamp",
        metaField: "metadata",
        granularity: "seconds",
      },
    })
    console.log("Created sensor_data time-series collection")
  } catch (error: any) {
    if (error.code !== 48) {
      // 48 = collection already exists
      console.error("Error creating sensor_data collection:", error)
    }
  }

  // Create time-series collection for actuator data
  try {
    await db.createCollection(COLLECTIONS.ACTUATOR_DATA, {
      timeseries: {
        timeField: "timestamp",
        metaField: "metadata",
        granularity: "seconds",
      },
    })
    console.log("Created actuator_data time-series collection")
  } catch (error: any) {
    if (error.code !== 48) {
      console.error("Error creating actuator_data collection:", error)
    }
  }

  // Create indexes for better query performance
  await db.collection(COLLECTIONS.SENSORS).createIndex({ id: 1 }, { unique: true })
  await db.collection(COLLECTIONS.SENSORS).createIndex({ user_id: 1 })
  await db.collection(COLLECTIONS.SENSORS).createIndex({ status: 1 })

  await db.collection(COLLECTIONS.SENSOR_DATA).createIndex({ sensor_id: 1, timestamp: -1 })

  await db.collection(COLLECTIONS.ACTUATORS).createIndex({ id: 1 }, { unique: true })
  await db.collection(COLLECTIONS.ACTUATORS).createIndex({ user_id: 1 })

  await db.collection(COLLECTIONS.ACTUATOR_DATA).createIndex({ actuator_id: 1, timestamp: -1 })

  await db.collection(COLLECTIONS.NOTIFICATIONS).createIndex({ user_id: 1, created_at: -1 })
  await db.collection(COLLECTIONS.NOTIFICATIONS).createIndex({ is_read: 1 })

  await db.collection(COLLECTIONS.API_KEYS).createIndex({ key: 1 }, { unique: true })

  console.log("Database initialized successfully")
}
