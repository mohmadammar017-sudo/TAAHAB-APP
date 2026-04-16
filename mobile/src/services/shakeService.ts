import { Accelerometer } from "expo-sensors";
import { Platform } from "react-native";

const SHAKE_MAGNITUDE_THRESHOLD = 1.95;
const SHAKE_DELTA_THRESHOLD = 0.75;
const SHAKE_COOLDOWN_MS = 2400;

export function subscribeToShake(onShake: () => void): () => void {
  if (Platform.OS === "web") {
    return () => undefined;
  }

  let lastMagnitude = 1;
  let lastTriggerAt = 0;

  Accelerometer.setUpdateInterval(180);

  const subscription = Accelerometer.addListener(({ x, y, z }) => {
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const delta = Math.abs(magnitude - lastMagnitude);
    const now = Date.now();

    lastMagnitude = magnitude;

    if (
      magnitude >= SHAKE_MAGNITUDE_THRESHOLD &&
      delta >= SHAKE_DELTA_THRESHOLD &&
      now - lastTriggerAt > SHAKE_COOLDOWN_MS
    ) {
      lastTriggerAt = now;
      onShake();
    }
  });

  return () => {
    subscription.remove();
  };
}
