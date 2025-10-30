import type { Sensor, Actuator, SensorData, Notification } from "@/types/database"

const API_BASE = "/api"

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "API Error" }))
    throw new Error(error.message || `API Error: ${response.status}`)
  }

  return response.json()
}

// Sensors API
export const sensorsApi = {
  // Get all sensors
  getAll: () => apiCall<Sensor[]>("/sensors"),

  // Get sensor by ID
  getById: (id: string) => apiCall<Sensor>(`/sensors/${id}`),

  // Create new sensor
  create: (data: Partial<Sensor>) =>
    apiCall<Sensor>("/sensors", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update sensor
  update: (id: string, data: Partial<Sensor>) =>
    apiCall<Sensor>(`/sensors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete sensor
  delete: (id: string) =>
    apiCall<{ success: boolean }>(`/sensors/${id}`, {
      method: "DELETE",
    }),
}

// Sensor Data API
export const sensorDataApi = {
  // Get sensor data with filters
  get: (params?: {
    sensorId?: string
    from?: string
    to?: string
    limit?: number
  }) => {
    const query = new URLSearchParams()
    if (params?.sensorId) query.set("sensorId", params.sensorId)
    if (params?.from) query.set("from", params.from)
    if (params?.to) query.set("to", params.to)
    if (params?.limit) query.set("limit", params.limit.toString())

    return apiCall<SensorData[]>(`/sensor-data?${query}`)
  },

  // Post sensor data
  post: (data: Partial<SensorData> | Partial<SensorData>[]) =>
    apiCall<{ success: boolean; count: number }>("/sensor-data", {
      method: "POST",
      body: JSON.stringify(Array.isArray(data) ? data : [data]),
    }),
}

// Actuators API
export const actuatorsApi = {
  // Get all actuators
  getAll: () => apiCall<Actuator[]>("/actuators"),

  // Control actuator
  control: (id: string, state: boolean) =>
    apiCall<Actuator>(`/actuators/${id}/control`, {
      method: "POST",
      body: JSON.stringify({ state }),
    }),
}

// Notifications API
export const notificationsApi = {
  // Get notifications
  get: (params?: { unreadOnly?: boolean; limit?: number }) => {
    const query = new URLSearchParams()
    if (params?.unreadOnly) query.set("unreadOnly", "true")
    if (params?.limit) query.set("limit", params.limit.toString())

    return apiCall<Notification[]>(`/notifications?${query}`)
  },

  // Mark as read
  markAsRead: (id: string) =>
    apiCall<{ success: boolean }>(`/notifications`, {
      method: "PUT",
      body: JSON.stringify({ id }),
    }),
}
