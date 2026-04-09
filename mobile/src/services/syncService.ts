import { Platform } from "react-native";
import { setAlertStatus } from "./alertService";
import { getAllAlerts, saveAlert } from "./storageService";
import type { AlertPacket } from "../types/alert";
import { nowIso } from "../utils/time";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  Platform.select({
    android: "http://10.0.2.2:4000",
    ios: "http://localhost:4000",
    default: "http://localhost:4000"
  });

export async function uploadAlert(alert: AlertPacket): Promise<AlertPacket> {
  const response = await fetch(`${API_BASE_URL}/api/alerts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(alert)
  });

  if (!response.ok) {
    throw new Error("فشل رفع البلاغ إلى الخادم");
  }

  return alert;
}

export async function syncPendingAlerts(
  hasInternet: boolean
): Promise<AlertPacket[]> {
  if (!hasInternet) {
    throw new Error("لا يوجد اتصال بالإنترنت لرفع البلاغات");
  }

  const alerts = await getAllAlerts();
  const pendingAlerts = alerts.filter((alert) => alert.status !== "synced");
  const syncedAlerts: AlertPacket[] = [];

  for (const alert of pendingAlerts) {
    await uploadAlert(alert);

    const updatedAlert = setAlertStatus(
      alert,
      "synced",
      "تم رفع البلاغ بنجاح إلى غرفة العمليات",
      "success",
      {
        syncedAt: nowIso()
      }
    );

    await saveAlert(updatedAlert);
    syncedAlerts.push(updatedAlert);
  }

  return syncedAlerts;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
