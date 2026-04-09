export type AlertType = "fire" | "accident" | "injury" | "suspicious" | "security";
export type AlertSeverity = "low" | "medium" | "high";
export type AlertStatus =
  | "created"
  | "encrypted"
  | "stored"
  | "pending_relay"
  | "relayed"
  | "synced";

export interface AlertLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface AlertLogEntry {
  id: string;
  message: string;
  timestamp: string;
  level: "info" | "success" | "warning";
}

export interface AlertPacket {
  id: string;
  type: AlertType;
  description: string;
  severity: AlertSeverity;
  location: AlertLocation;
  createdAt: string;
  lastUpdatedAt: string;
  encryptedPayload: string;
  encryptionLabel: string;
  status: AlertStatus;
  hopCount: number;
  relayHistory: string[];
  createdByDeviceId: string;
  currentDeviceId: string;
  nearbyDeviceId?: string;
  syncedAt?: string;
  logs: AlertLogEntry[];
}

export interface CreateAlertInput {
  type: AlertType;
  description: string;
  severity: AlertSeverity;
}

export const ALERT_TYPE_OPTIONS: Array<{ value: AlertType; label: string }> = [
  { value: "fire", label: "حريق" },
  { value: "accident", label: "حادث" },
  { value: "injury", label: "إصابة" },
  { value: "suspicious", label: "جسم مشبوه" },
  { value: "security", label: "خطر أمني" }
];

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  fire: "حريق",
  accident: "حادث",
  injury: "إصابة",
  suspicious: "جسم مشبوه",
  security: "خطر أمني"
};

export const SEVERITY_OPTIONS: Array<{ value: AlertSeverity; label: string }> = [
  { value: "low", label: "منخفض" },
  { value: "medium", label: "متوسط" },
  { value: "high", label: "عالٍ" }
];

export const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  low: "منخفض",
  medium: "متوسط",
  high: "عالٍ"
};

export const STATUS_LABELS: Record<AlertStatus, string> = {
  created: "تم الإنشاء",
  encrypted: "مشفّر",
  stored: "محفوظ محليًا",
  pending_relay: "بانتظار التمرير",
  relayed: "تم تمريره",
  synced: "تمت المزامنة"
};

