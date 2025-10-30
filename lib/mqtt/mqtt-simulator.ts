type MQTTMessage = {
  topic: string
  payload: any
  qos: 0 | 1 | 2
  timestamp: Date
}

type MQTTSubscriber = {
  topic: string
  callback: (message: MQTTMessage) => void
}

export class MQTTSimulator {
  private subscribers: MQTTSubscriber[] = []
  private messageQueue: MQTTMessage[] = []
  private connected = false
  private clientId: string

  constructor(clientId = `mqtt_client_${Date.now()}`) {
    this.clientId = clientId
  }

  connect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.connected = true
        console.log(`[v0] MQTT Client ${this.clientId} connected`)
        resolve()
      }, 100)
    })
  }

  disconnect(): void {
    this.connected = false
    this.subscribers = []
    console.log(`[v0] MQTT Client ${this.clientId} disconnected`)
  }

  isConnected(): boolean {
    return this.connected
  }

  publish(topic: string, payload: any, qos: 0 | 1 | 2 = 0): void {
    if (!this.connected) {
      console.error("[v0] MQTT Client not connected")
      return
    }

    const message: MQTTMessage = {
      topic,
      payload,
      qos,
      timestamp: new Date(),
    }

    this.messageQueue.push(message)
    console.log(`[v0] MQTT Published to ${topic}:`, payload)

    // Deliver to subscribers
    this.deliverMessage(message)
  }

  subscribe(topic: string, callback: (message: MQTTMessage) => void): void {
    if (!this.connected) {
      console.error("[v0] MQTT Client not connected")
      return
    }

    this.subscribers.push({ topic, callback })
    console.log(`[v0] MQTT Subscribed to ${topic}`)
  }

  unsubscribe(topic: string): void {
    this.subscribers = this.subscribers.filter((sub) => sub.topic !== topic)
    console.log(`[v0] MQTT Unsubscribed from ${topic}`)
  }

  private deliverMessage(message: MQTTMessage): void {
    this.subscribers.forEach((subscriber) => {
      if (this.topicMatches(subscriber.topic, message.topic)) {
        subscriber.callback(message)
      }
    })
  }

  private topicMatches(pattern: string, topic: string): boolean {
    // Simple wildcard matching for MQTT topics
    // + matches single level, # matches multiple levels
    const patternParts = pattern.split("/")
    const topicParts = topic.split("/")

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] === "#") {
        return true
      }
      if (patternParts[i] === "+") {
        continue
      }
      if (patternParts[i] !== topicParts[i]) {
        return false
      }
    }

    return patternParts.length === topicParts.length
  }

  getMessageHistory(topic?: string): MQTTMessage[] {
    if (topic) {
      return this.messageQueue.filter((msg) => this.topicMatches(topic, msg.topic))
    }
    return [...this.messageQueue]
  }
}

// Global MQTT broker simulator
let globalBroker: MQTTSimulator | null = null

export function getMQTTBroker(): MQTTSimulator {
  if (!globalBroker) {
    globalBroker = new MQTTSimulator("global_broker")
    globalBroker.connect()
  }
  return globalBroker
}
