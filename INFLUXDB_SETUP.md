# InfluxDB Setup Guide

## Architecture Overview

This IoT platform uses a hybrid database architecture:
- **Supabase (PostgreSQL)**: User authentication, sensor/actuator metadata, notifications
- **InfluxDB**: Time-series sensor readings and actuator state history

## Why InfluxDB?

InfluxDB is optimized for time-series data with:
- High write throughput (1,000+ writes/second)
- Efficient storage compression for time-series data
- Built-in downsampling and retention policies
- Fast time-based queries and aggregations
- Tags for efficient filtering (sensor_id, location, protocol)

## Data Model

### Measurements

#### sensor_reading
- **Tags**: sensor_id, sensor_type, location, protocol
- **Fields**: value (float)
- **Timestamp**: Automatic

#### actuator_state
- **Tags**: actuator_id, actuator_type, location, protocol
- **Fields**: state (boolean), value (float)
- **Timestamp**: Automatic

## Installation

### Option 1: Docker (Recommended)

\`\`\`bash
docker run -d -p 8086:8086 \
  --name influxdb \
  -v influxdb-data:/var/lib/influxdb2 \
  influxdb:2.7
\`\`\`

### Option 2: Local Installation

Download from: https://www.influxdata.com/downloads/

## Initial Setup

1. Access InfluxDB UI at http://localhost:8086
2. Create initial user and organization
3. Create bucket named `sensor-data`
4. Generate API token with read/write permissions
5. Add credentials to `.env.local`:

\`\`\`env
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your_token_here
INFLUXDB_ORG=iot-platform
INFLUXDB_BUCKET=sensor-data
\`\`\`

## Retention Policies

Configure data retention based on your needs:

```flux
// Keep raw data for 7 days
option task = {name: "downsample-7d", every: 1h}

from(bucket: "sensor-data")
  |> range(start: -7d)
  |> aggregateWindow(every: 1h, fn: mean)
  |> to(bucket: "sensor-data-downsampled")
