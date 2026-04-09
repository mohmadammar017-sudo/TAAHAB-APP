const SHIFT_SEED = 11;

export const ENCRYPTION_METHOD = "AES-256 Mock Envelope";

export function encryptAlert<T extends object>(data: T): string {
  const json = JSON.stringify(data);

  return Array.from(json)
    .map((character, index) => {
      const shifted = character.charCodeAt(0) + SHIFT_SEED + (index % 7);
      return shifted.toString(16).padStart(4, "0");
    })
    .join("");
}

export function decryptAlert<T>(payload: string): T {
  const chars: string[] = [];

  for (let index = 0; index < payload.length; index += 4) {
    const block = payload.slice(index, index + 4);
    const value = parseInt(block, 16) - SHIFT_SEED - ((index / 4) % 7);
    chars.push(String.fromCharCode(value));
  }

  return JSON.parse(chars.join("")) as T;
}

