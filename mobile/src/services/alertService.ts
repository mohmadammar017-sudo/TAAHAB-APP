import { ENCRYPTION_METHOD, encryptAlert } from "./encryptionService";
import { getCurrentLocation } from "./locationService";
import { saveAlert } from "./storageService";
import type { AlertLogEntry, AlertPacket, AlertStatus, CreateAlertInput } from "../types/alert";
import { createLogEntry, nowIso } from "../utils/time";
import { generateId } from "../utils/uuid";

export const DEFAULT_DEVICE_ID = "Device-A";

export function appendLog(
  alert: AlertPacket,
  message: string,
  level: AlertLogEntry["level"] = "info"
): AlertPacket {
  return {
    ...alert,
    lastUpdatedAt: nowIso(),
    logs: [...alert.logs, createLogEntry(message, level)]
  };
}

export function setAlertStatus(
  alert: AlertPacket,
  status: AlertStatus,
  message: string,
  level: AlertLogEntry["level"] = "info",
  patch: Partial<AlertPacket> = {}
): AlertPacket {
  return {
    ...alert,
    ...patch,
    status,
    lastUpdatedAt: nowIso(),
    logs: [...alert.logs, createLogEntry(message, level)]
  };
}

export async function createAlert(
  input: CreateAlertInput,
  deviceId = DEFAULT_DEVICE_ID
): Promise<AlertPacket> {
  const createdAt = nowIso();
  const location = await getCurrentLocation();

  let alert: AlertPacket = {
    id: generateId("ALERT"),
    type: input.type,
    description: input.description.trim(),
    severity: input.severity,
    location,
    createdAt,
    lastUpdatedAt: createdAt,
    encryptedPayload: "",
    encryptionLabel: ENCRYPTION_METHOD,
    status: "created",
    hopCount: 0,
    relayHistory: [deviceId],
    createdByDeviceId: deviceId,
    currentDeviceId: deviceId,
    logs: []
  };

  alert = setAlertStatus(alert, "created", "تم إنشاء البلاغ", "success");

  const encryptedPayload = encryptAlert({
    id: alert.id,
    type: alert.type,
    description: alert.description,
    severity: alert.severity,
    location: alert.location,
    createdAt: alert.createdAt,
    createdByDeviceId: alert.createdByDeviceId
  });

  alert = setAlertStatus(
    { ...alert, encryptedPayload },
    "encrypted",
    `تم تشفير البلاغ باستخدام ${ENCRYPTION_METHOD}`,
    "info"
  );

  alert = setAlertStatus(alert, "stored", "تم حفظ البلاغ محليًا", "success");
  alert = setAlertStatus(
    alert,
    "pending_relay",
    "البلاغ جاهز للتمرير عبر الشبكة المحلية",
    "warning"
  );

  await saveAlert(alert);
  return alert;
}

