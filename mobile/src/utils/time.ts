import type { AlertLogEntry } from "../types/alert";
import { generateId } from "./uuid";

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function formatTimestamp(value: string): string {
  const date = new Date(value);

  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} - ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function createLogEntry(
  message: string,
  level: AlertLogEntry["level"] = "info"
): AlertLogEntry {
  return {
    id: generateId("LOG"),
    message,
    timestamp: nowIso(),
    level
  };
}

