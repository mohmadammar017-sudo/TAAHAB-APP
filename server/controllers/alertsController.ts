import { promises as fs } from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";

interface StoredAlertRecord {
  id: string;
  type: string;
  severity: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  createdAt: string;
  encryptedPayload: string;
  status: string;
  hopCount: number;
  relayHistory: string[];
  createdByDeviceId: string;
  currentDeviceId: string;
  syncedAt?: string;
  receivedAt?: string;
}

const currentWorkingDirectory = process.cwd();
const dataFilePath = currentWorkingDirectory.endsWith(`${path.sep}server`)
  ? path.resolve(currentWorkingDirectory, "data", "alerts.json")
  : path.resolve(currentWorkingDirectory, "server", "data", "alerts.json");

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });

  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.writeFile(dataFilePath, "[]", "utf-8");
  }
}

async function readAlerts(): Promise<StoredAlertRecord[]> {
  await ensureDataFile();
  const raw = await fs.readFile(dataFilePath, "utf-8");
  return JSON.parse(raw) as StoredAlertRecord[];
}

async function writeAlerts(alerts: StoredAlertRecord[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(dataFilePath, JSON.stringify(alerts, null, 2), "utf-8");
}

export async function createAlert(request: Request, response: Response): Promise<void> {
  const payload = request.body as StoredAlertRecord;

  if (!payload?.id || !payload?.type || !payload?.severity) {
    response.status(400).json({
      message: "الحقول الأساسية للبلاغ غير مكتملة"
    });
    return;
  }

  const alerts = await readAlerts();
  const index = alerts.findIndex((alert) => alert.id === payload.id);
  const record: StoredAlertRecord = {
    ...payload,
    status: "synced",
    receivedAt: new Date().toISOString()
  };

  if (index >= 0) {
    alerts[index] = record;
  } else {
    alerts.unshift(record);
  }

  await writeAlerts(alerts);

  response.status(201).json({
    message: "تم استلام البلاغ بنجاح",
    data: record
  });
}

export async function getAlerts(_request: Request, response: Response): Promise<void> {
  const alerts = await readAlerts();
  response.json(alerts.sort((left, right) => right.createdAt.localeCompare(left.createdAt)));
}

export async function getAlertById(request: Request, response: Response): Promise<void> {
  const alerts = await readAlerts();
  const alert = alerts.find((item) => item.id === request.params.id);

  if (!alert) {
    response.status(404).json({
      message: "البلاغ غير موجود"
    });
    return;
  }

  response.json(alert);
}
