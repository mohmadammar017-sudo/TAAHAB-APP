export function generateId(prefix = "ALT"): string {
  const seed = Math.random().toString(36).slice(2, 8).toUpperCase();
  const time = Date.now().toString(36).slice(-6).toUpperCase();

  return `${prefix}-${time}-${seed}`;
}

