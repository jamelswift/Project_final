// import { getDatabase, COLLECTIONS } from "./client"
// import type { Sensor, SensorData, Actuator, ActuatorData, Notification } from "./schemas"

// // Sensor queries
// export async function getSensors(userId?: string) {
//   const db = await getDatabase()
//   const query = userId ? { user_id: userId } : {}
//   return db.collection<Sensor>(COLLECTIONS.SENSORS).find(query).toArray()
// }

// export async function getSensorById(sensorId: string) {
//   const db = await getDatabase()
//   return db.collection<Sensor>(COLLECTIONS.SENSORS).findOne({ id: sensorId })
// }

// export async function createSensor(sensor: Omit<Sensor, "_id">) {
//   const db = await getDatabase()
//   const result = await db.collection<Sensor>(COLLECTIONS.SENSORS).insertOne(sensor as Sensor)
//   return result.insertedId
// }

// export async function updateSensor(sensorId: string, updates: Partial<Sensor>) {
//   const db = await getDatabase()
//   return db
//     .collection<Sensor>(COLLECTIONS.SENSORS)
//     .updateOne({ id: sensorId }, { $set: { ...updates, updated_at: new Date() } })
// }

// // Sensor data queries
// export async function insertSensorData(data: SensorData | SensorData[]) {
//   const db = await getDatabase()
//   const dataArray = Array.isArray(data) ? data : [data]
//   return db.collection<SensorData>(COLLECTIONS.SENSOR_DATA).insertMany(dataArray)
// }

// export async function getSensorData(sensorId: string, startTime: Date, endTime: Date, limit = 1000) {
//   const db = await getDatabase()
//   return db
//     .collection<SensorData>(COLLECTIONS.SENSOR_DATA)
//     .find({
//       sensor_id: sensorId,
//       timestamp: { $gte: startTime, $lte: endTime },
//     })
//     .sort({ timestamp: -1 })
//     .limit(limit)
//     .toArray()
// }

// export async function getLatestSensorData(sensorId: string) {
//   const db = await getDatabase()
//   return db
//     .collection<SensorData>(COLLECTIONS.SENSOR_DATA)
//     .findOne({ sensor_id: sensorId }, { sort: { timestamp: -1 } })
// }

// export async function getSensorDataStats(sensorId: string, startTime: Date, endTime: Date) {
//   const db = await getDatabase()
//   const result = await db
//     .collection<SensorData>(COLLECTIONS.SENSOR_DATA)
//     .aggregate([
//       {
//         $match: {
//           sensor_id: sensorId,
//           timestamp: { $gte: startTime, $lte: endTime },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           avg: { $avg: "$value" },
//           min: { $min: "$value" },
//           max: { $max: "$value" },
//           count: { $sum: 1 },
//         },
//       },
//     ])
//     .toArray()

//   return result[0] || { avg: 0, min: 0, max: 0, count: 0 }
// }

// // Actuator queries
// export async function getActuators(userId?: string) {
//   const db = await getDatabase()
//   const query = userId ? { user_id: userId } : {}
//   return db.collection<Actuator>(COLLECTIONS.ACTUATORS).find(query).toArray()
// }

// export async function getActuatorById(actuatorId: string) {
//   const db = await getDatabase()
//   return db.collection<Actuator>(COLLECTIONS.ACTUATORS).findOne({ id: actuatorId })
// }

// export async function updateActuatorState(actuatorId: string, state: boolean) {
//   const db = await getDatabase()
//   return db
//     .collection<Actuator>(COLLECTIONS.ACTUATORS)
//     .updateOne({ id: actuatorId }, { $set: { state, updated_at: new Date() } })
// }

// export async function insertActuatorData(data: ActuatorData) {
//   const db = await getDatabase()
//   return db.collection<ActuatorData>(COLLECTIONS.ACTUATOR_DATA).insertOne(data)
// }

// // Notification queries
// export async function createNotification(notification: Omit<Notification, "_id">) {
//   const db = await getDatabase()
//   return db.collection<Notification>(COLLECTIONS.NOTIFICATIONS).insertOne(notification as Notification)
// }

// export async function getNotifications(userId?: string, limit = 50) {
//   const db = await getDatabase()
//   const query = userId ? { user_id: userId } : {}
//   return db
//     .collection<Notification>(COLLECTIONS.NOTIFICATIONS)
//     .find(query)
//     .sort({ created_at: -1 })
//     .limit(limit)
//     .toArray()
// }

// export async function markNotificationAsRead(notificationId: string) {
//   const db = await getDatabase()
//   return db
//     .collection<Notification>(COLLECTIONS.NOTIFICATIONS)
//     .updateOne({ id: notificationId }, { $set: { is_read: true } })
// }

// export async function getUnreadNotificationCount(userId?: string) {
//   const db = await getDatabase()
//   const query = userId ? { user_id: userId, is_read: false } : { is_read: false }
//   return db.collection<Notification>(COLLECTIONS.NOTIFICATIONS).countDocuments(query)
// }
