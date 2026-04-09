import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AlertPacket, AlertStatus } from "../types/alert";

const STORAGE_KEY = "@taahab/alerts/v1";

async function readAlerts(): Promise<AlertPacket[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  const parsed = JSON.parse(raw) as AlertPacket[];

  return parsed.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

async function writeAlerts(alerts: AlertPacket[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

export async function saveAlert(alert: AlertPacket): Promise<AlertPacket> {
  const alerts = await readAlerts();
  const targetIndex = alerts.findIndex((item) => item.id === alert.id);

  if (targetIndex >= 0) {
    alerts[targetIndex] = alert;
  } else {
    alerts.unshift(alert);
  }

  await writeAlerts(alerts);

  return alert;
}

export async function getAllAlerts(): Promise<AlertPacket[]> {
  return readAlerts();
}

export async function getAlertById(id: string): Promise<AlertPacket | undefined> {
  const alerts = await readAlerts();
  return alerts.find((alert) => alert.id === id);
}

export async function updateAlertStatus(
  id: string,
  status: AlertStatus
): Promise<AlertPacket | undefined> {
  const alerts = await readAlerts();
  const targetIndex = alerts.findIndex((item) => item.id === id);

  if (targetIndex < 0) {
    return undefined;
  }

  alerts[targetIndex] = {
    ...alerts[targetIndex],
    status,
    lastUpdatedAt: new Date().toISOString()
  };

  await writeAlerts(alerts);
  return alerts[targetIndex];
}

export async function appendRelayHistory(
  id: string,
  deviceId: string
): Promise<AlertPacket | undefined> {
  const alerts = await readAlerts();
  const targetIndex = alerts.findIndex((item) => item.id === id);

  if (targetIndex < 0) {
    return undefined;
  }

  const alert = alerts[targetIndex];

  alerts[targetIndex] = {
    ...alert,
    currentDeviceId: deviceId,
    relayHistory: [...alert.relayHistory, deviceId],
    hopCount: alert.hopCount + 1,
    lastUpdatedAt: new Date().toISOString()
  };

  await writeAlerts(alerts);
  return alerts[targetIndex];
}

export async function deleteAllAlerts(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

