import { type NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api/auth-middleware";

// 🔧 MOCK functions (แทนที่การเชื่อม MongoDB ชั่วคราว)
async function insertSensorData(data: any[]) {
  console.log("💡 Mock insertSensorData called:", data.length, "record(s)");
  return true;
}

async function getSensorData(sensorId: string, start: Date, end: Date) {
  console.log("💡 Mock getSensorData called:", sensorId);
  // ข้อมูลจำลอง (mock data)
  return [
    { id: 1, sensor_id: sensorId, value: 25.5, timestamp: new Date().toISOString() },
    { id: 2, sensor_id: sensorId, value: 26.1, timestamp: new Date().toISOString() },
  ];
}

async function getLatestSensorData(sensorId: string) {
  console.log("💡 Mock getLatestSensorData called:", sensorId);
  return { sensor_id: sensorId, value: 25.7, timestamp: new Date().toISOString() };
}

// ========================
// 📡 GET Method
// ========================
export async function GET(request: NextRequest) {
  const authResult = await verifyApiKey(request);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const sensorId = searchParams.get("sensor_id");
  const startTime = searchParams.get("start_time");
  const endTime = searchParams.get("end_time");
  const latest = searchParams.get("latest") === "true";

  if (!sensorId) {
    return NextResponse.json({ error: "sensor_id is required" }, { status: 400 });
  }

  try {
    if (latest) {
      const data = await getLatestSensorData(sensorId);
      return NextResponse.json({ sensor_id: sensorId, data });
    }

    const start = startTime ? new Date(startTime) : new Date(Date.now() - 3600000); // 1 ชม. ล่าสุด
    const end = endTime ? new Date(endTime) : new Date();

    const data = await getSensorData(sensorId, start, end);
    return NextResponse.json({ data, count: data.length });
  } catch (error) {
    console.error("[v0] Error querying sensor data:", error);
    return NextResponse.json({ error: "Failed to query sensor data" }, { status: 500 });
  }
}

// ========================
// 📨 POST Method
// ========================
export async function POST(request: NextRequest) {
  const authResult = await verifyApiKey(request);
  if (!authResult.authorized || !authResult.permissions?.write) {
    return NextResponse.json({ error: "Write permission required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const dataArray = Array.isArray(body) ? body : [body];

    const sensorData = dataArray.map((item) => ({
      sensor_id: item.sensor_id,
      value: item.value,
      unit: item.unit || "",
      timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
      metadata: {
        location: item.location || "N/A",
        protocol: item.protocol || "virtual",
      },
    }));

    await insertSensorData(sensorData); // mock insert

    return NextResponse.json({
      success: true,
      message: `${sensorData.length} sensor data point(s) (mock) written successfully.`,
    });
  } catch (error) {
    console.error("[v0] Error writing sensor data:", error);
    return NextResponse.json({ error: "Failed to write sensor data" }, { status: 500 });
  }
}
