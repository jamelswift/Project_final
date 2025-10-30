# MongoDB Setup Guide

## 1. Create MongoDB Atlas Account (Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a new cluster (M0 Free tier is sufficient for development)

## 2. Configure Database Access

1. Go to **Database Access** in the left sidebar
2. Click **Add New Database User**
3. Create a username and password
4. Set privileges to **Read and write to any database**

## 3. Configure Network Access

1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. For development: Click **Allow Access from Anywhere** (0.0.0.0/0)
4. For production: Add your server's IP address

## 4. Get Connection String

1. Go to **Database** in the left sidebar
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Add to your `.env` file as `MONGODB_URI`

Example:
\`\`\`
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/iot-platform?retryWrites=true&w=majority
\`\`\`

## 5. Initialize Database

The database will be automatically initialized on first connection with:
- Time-series collections for sensor_data and actuator_data
- Indexes for optimal query performance
- Proper schema validation

## Performance Features

### Time-Series Collections
MongoDB automatically optimizes storage and queries for time-series data:
- Efficient compression (up to 90% storage reduction)
- Fast time-range queries
- Automatic data retention policies

### Indexes
Pre-configured indexes for:
- Sensor ID + timestamp queries
- User-based filtering
- Status filtering
- Notification queries

### Write Performance
- Supports 1,000+ writes per second on M0 tier
- Batch inserts for better throughput
- Automatic sharding for horizontal scaling

## Monitoring

Monitor your database in MongoDB Atlas:
- **Metrics**: View real-time performance metrics
- **Performance Advisor**: Get index recommendations
- **Alerts**: Set up alerts for high CPU, memory, or disk usage

## Backup & Recovery

MongoDB Atlas provides:
- Continuous backups (on paid tiers)
- Point-in-time recovery
- Automated snapshots

## Scaling

When you need more performance:
1. Upgrade to M10+ tier for dedicated resources
2. Enable sharding for horizontal scaling
3. Add read replicas for read-heavy workloads
