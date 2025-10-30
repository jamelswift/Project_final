import { getMQTTBroker } from "./mqtt-simulator"
import { getActuatorTopic } from "./mqtt-topics"
import type { Actuator } from "@/types/database"

export class MQTTActuatorBridge {
  private broker = getMQTTBroker()

  subscribeCommands(callback: (actuatorId: string, command: { state: boolean; value?: number }) => void): void {
    this.broker.subscribe("iot/actuators/+/command", (message) => {
      const parsed = message.topic.match(/^iot\/actuators\/([^/]+)\/command$/)
      if (parsed) {
        const actuatorId = parsed[1]
        callback(actuatorId, message.payload)
      }
    })
  }

  publishCommand(actuatorId: string, state: boolean, value?: number): void {
    const topic = getActuatorTopic(actuatorId, "command")
    this.broker.publish(topic, { state, value: value || 0 })
  }

  publishState(actuator: Actuator): void {
    const topic = getActuatorTopic(actuator.id, "state")
    this.broker.publish(topic, {
      actuator_id: actuator.id,
      actuator_name: actuator.name,
      state: actuator.state,
      value: actuator.value,
      timestamp: new Date().toISOString(),
    })
  }

  publishStatus(actuatorId: string, status: "active" | "inactive" | "error"): void {
    const topic = getActuatorTopic(actuatorId, "status")
    this.broker.publish(topic, { status, timestamp: new Date().toISOString() })
  }
}
