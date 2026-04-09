import { appendLog, setAlertStatus } from "./alertService";
import type { AlertPacket } from "../types/alert";
import type { MeshDevice } from "../types/device";
import { nowIso } from "../utils/time";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DEMO_DEVICE_TEMPLATE: MeshDevice[] = [
  {
    id: "Device-A",
    name: "جهاز المبلّغ",
    batteryLevel: 82,
    hasInternet: false,
    isReachable: true,
    lastSeenAt: nowIso()
  },
  {
    id: "Device-B",
    name: "Relay-01",
    batteryLevel: 68,
    hasInternet: false,
    isReachable: false,
    lastSeenAt: nowIso()
  },
  {
    id: "Device-C",
    name: "Relay-02",
    batteryLevel: 54,
    hasInternet: true,
    isReachable: false,
    lastSeenAt: nowIso()
  }
];

function getReachableTargets(currentDeviceId: string): string[] {
  if (currentDeviceId === "Device-A") {
    return ["Device-B"];
  }

  if (currentDeviceId === "Device-B") {
    return ["Device-C"];
  }

  return [];
}

export function createDemoDevices(): MeshDevice[] {
  return DEMO_DEVICE_TEMPLATE.map((device) => ({
    ...device,
    lastSeenAt: nowIso()
  }));
}

export function getDeviceById(devices: MeshDevice[], deviceId: string): MeshDevice | undefined {
  return devices.find((device) => device.id === deviceId);
}

export function syncDeviceAvailability(
  devices: MeshDevice[],
  currentDeviceId: string,
  nearbyDeviceId?: string
): MeshDevice[] {
  const reachable = new Set(getReachableTargets(currentDeviceId));

  return devices.map((device) => ({
    ...device,
    isReachable:
      device.id === currentDeviceId ||
      device.id === nearbyDeviceId ||
      reachable.has(device.id),
    lastSeenAt: nowIso()
  }));
}

export async function scanNearbyDevices(
  currentDeviceId: string,
  devices: MeshDevice[]
): Promise<MeshDevice[]> {
  await delay(700);
  const reachable = new Set(getReachableTargets(currentDeviceId));

  return devices
    .filter((device) => reachable.has(device.id))
    .map((device) => ({
      ...device,
      isReachable: true,
      lastSeenAt: nowIso()
    }));
}

export async function connectToDevice(
  deviceId: string,
  devices: MeshDevice[]
): Promise<MeshDevice | null> {
  await delay(400);
  return devices.find((device) => device.id === deviceId) ?? null;
}

export async function relayAlert(
  alert: AlertPacket,
  targetDeviceId: string,
  devices: MeshDevice[]
): Promise<AlertPacket> {
  const target = await connectToDevice(targetDeviceId, devices);

  if (!target) {
    throw new Error("تعذر الاتصال بالجهاز الهدف");
  }

  let updated = setAlertStatus(
    alert,
    "relayed",
    `تم تمرير البلاغ إلى ${target.name}`,
    "success",
    {
      currentDeviceId: target.id,
      nearbyDeviceId: undefined,
      hopCount: alert.hopCount + 1,
      relayHistory: [...alert.relayHistory, target.id]
    }
  );

  if (target.hasInternet) {
    updated = appendLog(updated, "تم العثور على نقطة اتصال فعّالة على الجهاز الحالي", "success");
  }

  return updated;
}

export async function scanNearbyDevicesPlaceholder(): Promise<MeshDevice[]> {
  await delay(250);
  return [];
}

export function flagDeviceInternet(
  devices: MeshDevice[],
  deviceId: string,
  hasInternet: boolean
): MeshDevice[] {
  return devices.map((device) =>
    device.id === deviceId
      ? {
          ...device,
          hasInternet,
          lastSeenAt: nowIso()
        }
      : device
  );
}

