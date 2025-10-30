# IoT Platform API Documentation

## Authentication

All API endpoints require authentication using an API key. Include the API key in the request header:

\`\`\`
X-API-Key: your_api_key_here
\`\`\`

## Base URL

\`\`\`
https://your-domain.com/api
\`\`\`

## Endpoints

### Sensors

#### GET /api/sensors
Get all sensors with optional filtering.

**Query Parameters:**
- `type` (optional): Filter by sensor type (temperature, humidity, pressure, motion, light, air_quality)
- `status` (optional): Filter by status (active, inactive, error)
- `protocol` (optional): Filter by protocol (mqtt, http, virtual)

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "uuid",
      "name": "Temperature Sensor 1",
      "type": "temperature",
      "unit": "°C",
      "location": "Room A",
      "protocol": "mqtt",
      "status": "active",
      "min_threshold": 15,
      "max_threshold": 30,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
\`\`\`

#### POST /api/sensors
Create a new sensor.

**Request Body:**
\`\`\`json
{
  "name": "New Sensor",
  "type": "temperature",
  "unit": "°C",
  "location": "Room B",
  "protocol": "mqtt",
  "min_threshold": 15,
  "max_threshold": 30
}
\`\`\`

#### GET /api/sensors/:id
Get a specific sensor by ID.

#### PATCH /api/sensors/:id
Update a sensor.

#### DELETE /api/sensors/:id
Delete a sensor.

### Sensor Data

#### GET /api/sensor-data
Get sensor data with optional filtering.

**Query Parameters:**
- `sensor_id` (optional): Filter by sensor ID
- `limit` (optional): Limit results (default: 100, max: 1000)
- `from` (optional): Start timestamp (ISO 8601)
- `to` (optional): End timestamp (ISO 8601)

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "sensor_id": "uuid",
      "value": 25.5,
      "timestamp": "2025-01-01T00:00:00Z",
      "metadata": null
    }
  ],
  "count": 1
}
\`\`\`

#### POST /api/sensor-data
Insert sensor data (supports batch insert).

**Request Body (Single):**
\`\`\`json
{
  "sensor_id": "uuid",
  "value": 25.5,
  "metadata": {}
}
\`\`\`

**Request Body (Batch):**
\`\`\`json
[
  {
    "sensor_id": "uuid",
    "value": 25.5
  },
  {
    "sensor_id": "uuid",
    "value": 26.0
  }
]
\`\`\`

### Actuators

#### GET /api/actuators
Get all actuators with optional filtering.

**Query Parameters:**
- `type` (optional): Filter by type (switch, motor, valve, relay, dimmer)
- `status` (optional): Filter by status (active, inactive, error)

#### POST /api/actuators/:id/control
Control an actuator.

**Request Body:**
\`\`\`json
{
  "state": true,
  "value": 100
}
\`\`\`

### Notifications

#### GET /api/notifications
Get notifications with optional filtering.

**Query Parameters:**
- `is_read` (optional): Filter by read status (true/false)
- `severity` (optional): Filter by severity (info, warning, critical)
- `limit` (optional): Limit results (default: 50)

## Rate Limits

- 1,000 requests per minute per API key
- Batch operations count as single requests

## Error Responses

\`\`\`json
{
  "error": "Error message"
}
\`\`\`

**Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error
