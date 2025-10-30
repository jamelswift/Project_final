import type { ActuatorData } from "@/types/sensor"

export class ActuatorSimulator {
  private actuators: Map<string, ActuatorData> = new Map()

  constructor() {
    this.initializeActuators()
  }

  private initializeActuators() {
    const defaultActuators: ActuatorData[] = [
      {
        id: "switch-01",
        name: "LED Light",
        type: "switch",
        state: false,
        status: "online",
        lastUpdate: new Date(),
      },
      {
        id: "switch-02",
        name: "Cooling Fan",
        type: "switch",
        state: false,
        status: "online",
        lastUpdate: new Date(),
      },
      {
        id: "motor-01",
        name: "Servo Motor",
        type: "motor",
        state: false,
        status: "online",
        lastUpdate: new Date(),
      },
      {
        id: "valve-01",
        name: "Water Valve",
        type: "valve",
        state: false,
        status: "online",
        lastUpdate: new Date(),
      },
    ]

    defaultActuators.forEach((actuator) => {
      this.actuators.set(actuator.id, actuator)
    })
  }

  toggleActuator(actuatorId: string) {
    const actuator = this.actuators.get(actuatorId)
    if (actuator && actuator.status === "online") {
      actuator.state = !actuator.state
      actuator.lastUpdate = new Date()
    }
  }

  getActuators(): ActuatorData[] {
    return Array.from(this.actuators.values())
  }

  setActuatorState(actuatorId: string, state: boolean) {
    const actuator = this.actuators.get(actuatorId)
    if (actuator && actuator.status === "online") {
      actuator.state = state
      actuator.lastUpdate = new Date()
    }
  }

  toggleActuatorStatus(actuatorId: string) {
    const actuator = this.actuators.get(actuatorId)
    if (actuator) {
      actuator.status = actuator.status === "online" ? "offline" : "online"
    }
  }
}
