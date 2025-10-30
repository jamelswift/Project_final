"use client"

import { useEffect, useState } from "react"
import type { Sensor, Actuator, Notification } from "@/types/database"
import { SensorSimulator } from "@/lib/sensor-simulator"
import { ActuatorSimulator } from "@/lib/actuator-simulator"
import { MQTTSensorBridge } from "@/lib/mqtt/mqtt-sensor-bridge"
import { MQTTActuatorBridge } from "@/lib/mqtt/mqtt-actuator-bridge"
import { ThresholdMonitor } from "@/lib/notifications/threshold-monitor"
import { SensorCard } from "@/components/sensor-card"
import { ActuatorCard } from "@/components/actuator-card"
import { SensorChart } from "@/components/sensor-chart"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { AlertToast } from "@/components/notifications/alert-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, Activity, Wifi, WifiOff, Database, Zap } from "lucide-react"

let sensorSimulator: SensorSimulator
let actuatorSimulator: ActuatorSimulator
let mqttSensorBridge: MQTTSensorBridge
let mqttActuatorBridge: MQTTActuatorBridge
let thresholdMonitor: ThresholdMonitor

export default function Home() {
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [actuators, setActuators] = useState<Actuator[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [sensorHistory, setSensorHistory] = useState<Map<string, Array<{ timestamp: string; value: number }>>>(
    new Map(),
  )
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null)
  const [mqttConnected, setMqttConnected] = useState(true)
  const [stats, setStats] = useState({
    totalSensors: 0,
    activeSensors: 0,
    totalActuators: 0,
    activeActuators: 0,
    dataPoints: 0,
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      sensorSimulator = new SensorSimulator()
      actuatorSimulator = new ActuatorSimulator()
      mqttSensorBridge = new MQTTSensorBridge()
      mqttActuatorBridge = new MQTTActuatorBridge()
      thresholdMonitor = new ThresholdMonitor()

      const initialSensors: Sensor[] = [
        {
          id: "sensor-1",
          name: "Temperature Sensor 1",
          type: "temperature",
          unit: "°C",
          location: "Room A",
          protocol: "mqtt",
          status: "active",
          min_threshold: 15,
          max_threshold: 30,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "sensor-2",
          name: "Temperature Sensor 2",
          type: "temperature",
          unit: "°C",
          location: "Room B",
          protocol: "http",
          status: "active",
          min_threshold: 15,
          max_threshold: 30,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "sensor-3",
          name: "Humidity Sensor",
          type: "humidity",
          unit: "%",
          location: "Room A",
          protocol: "mqtt",
          status: "active",
          min_threshold: 30,
          max_threshold: 70,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "sensor-4",
          name: "Pressure Sensor",
          type: "pressure",
          unit: "hPa",
          location: "Outdoor",
          protocol: "virtual",
          status: "active",
          min_threshold: 980,
          max_threshold: 1020,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "sensor-5",
          name: "Motion Sensor",
          type: "motion",
          unit: "boolean",
          location: "Entrance",
          protocol: "mqtt",
          status: "active",
          min_threshold: null,
          max_threshold: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

      const initialActuators: Actuator[] = [
        {
          id: "actuator-1",
          name: "LED Light",
          type: "switch",
          location: "Room A",
          protocol: "mqtt",
          status: "active",
          state: false,
          value: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "actuator-2",
          name: "Cooling Fan",
          type: "motor",
          location: "Room A",
          protocol: "mqtt",
          status: "active",
          state: false,
          value: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "actuator-3",
          name: "Servo Motor",
          type: "motor",
          location: "Room B",
          protocol: "http",
          status: "active",
          state: false,
          value: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "actuator-4",
          name: "Water Valve",
          type: "valve",
          location: "Garden",
          protocol: "virtual",
          status: "active",
          state: false,
          value: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

      setSensors(initialSensors)
      setActuators(initialActuators)

      thresholdMonitor.onNotification((notification) => {
        setNotifications((prev) => [notification, ...prev])
        setLatestNotification(notification)
      })

      mqttActuatorBridge.subscribeCommands((actuatorId, command) => {
        setActuators((prev) =>
          prev.map((a) => (a.id === actuatorId ? { ...a, state: command.state, value: command.value || 0 } : a)),
        )
      })

      updateStats(initialSensors, initialActuators, 0)
    }

    return () => {
      if (sensorSimulator) {
        sensorSimulator.stopSimulation()
      }
      if (mqttSensorBridge) {
        mqttSensorBridge.stopPublishing()
      }
      if (thresholdMonitor) {
        thresholdMonitor.clearCallbacks()
      }
    }
  }, [])

  const updateStats = (sensors: Sensor[], actuators: Actuator[], dataPoints: number) => {
    setStats({
      totalSensors: sensors.length,
      activeSensors: sensors.filter((s) => s.status === "active").length,
      totalActuators: actuators.length,
      activeActuators: actuators.filter((a) => a.state).length,
      dataPoints,
    })
  }

  const toggleSimulation = () => {
    if (isRunning) {
      sensorSimulator.stopSimulation()
      mqttSensorBridge.stopPublishing()
      setIsRunning(false)
    } else {
      mqttSensorBridge.startPublishing(sensors)

      mqttSensorBridge.subscribeSensorData((data) => {
        // Update sensor history
        setSensorHistory((prev) => {
          const newHistory = new Map(prev)
          const history = newHistory.get(data.sensor_id) || []
          const newEntry = { timestamp: data.timestamp, value: data.value }
          const updatedHistory = [...history, newEntry].slice(-50) // Keep last 50 points
          newHistory.set(data.sensor_id, updatedHistory)
          return newHistory
        })

        const sensor = sensors.find((s) => s.id === data.sensor_id)
        if (sensor) {
          thresholdMonitor.checkThreshold(sensor, data)
        }

        setStats((prev) => ({ ...prev, dataPoints: prev.dataPoints + 1 }))
      })

      setIsRunning(true)
    }
  }

  const handleActuatorToggle = (actuatorId: string) => {
    const actuator = actuators.find((a) => a.id === actuatorId)
    if (!actuator) return

    const newState = !actuator.state

    mqttActuatorBridge.publishCommand(actuatorId, newState, newState ? 100 : 0)

    setActuators((prev) =>
      prev.map((a) => (a.id === actuatorId ? { ...a, state: newState, value: newState ? 100 : 0 } : a)),
    )

    updateStats(sensors, actuators, stats.dataPoints)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 text-balance">IoT Platform</h1>
                <p className="text-sm text-slate-600">Wireless Sensor Network Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={mqttConnected ? "default" : "destructive"} className="gap-1">
                {mqttConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {mqttConnected ? "MQTT Connected" : "MQTT Disconnected"}
              </Badge>
              <NotificationBell initialNotifications={notifications} />
              <Button
                onClick={toggleSimulation}
                size="lg"
                className="gap-2"
                variant={isRunning ? "destructive" : "default"}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Sensors</CardDescription>
              <CardTitle className="text-3xl">{stats.totalSensors}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{stats.activeSensors} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Actuators</CardDescription>
              <CardTitle className="text-3xl">{stats.totalActuators}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{stats.activeActuators} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Data Points</CardDescription>
              <CardTitle className="text-3xl">{stats.dataPoints.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Database className="h-3 w-3" />
                Real-time ingestion
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Alerts</CardDescription>
              <CardTitle className="text-3xl">{notifications.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Zap className="h-3 w-3" />
                Threshold monitoring
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sensors">Sensors</TabsTrigger>
            <TabsTrigger value="actuators">Actuators</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Sensors Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Virtual Sensors</CardTitle>
                <CardDescription>Real-time sensor data from MQTT, HTTP, and virtual protocols</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sensors.map((sensor) => (
                    <SensorCard key={sensor.id} sensor={sensor} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actuators Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Actuator Controls</CardTitle>
                <CardDescription>Control devices through MQTT commands</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {actuators.map((actuator) => (
                    <ActuatorCard key={actuator.id} actuator={actuator} onToggle={handleActuatorToggle} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sensors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sensors.map((sensor) => (
                <SensorCard key={sensor.id} sensor={sensor} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="actuators" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {actuators.map((actuator) => (
                <ActuatorCard key={actuator.id} actuator={actuator} onToggle={handleActuatorToggle} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {isRunning && sensorHistory.size > 0 ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Real-time Data Visualization</CardTitle>
                    <CardDescription>Live sensor data charts with 50-point history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {sensors.slice(0, 4).map((sensor) => {
                        const history = sensorHistory.get(sensor.id) || []
                        return (
                          <SensorChart
                            key={sensor.id}
                            title={sensor.name}
                            data={history}
                            unit={sensor.unit}
                            color={
                              sensor.type === "temperature"
                                ? "hsl(var(--chart-1))"
                                : sensor.type === "humidity"
                                  ? "hsl(var(--chart-2))"
                                  : sensor.type === "pressure"
                                    ? "hsl(var(--chart-3))"
                                    : "hsl(var(--chart-4))"
                            }
                          />
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Start the simulation to view real-time analytics</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {latestNotification && <AlertToast notification={latestNotification} />}
    </div>
  )
}
