import * as Network from "expo-network";

export async function getCurrentNetworkStatus(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync();
    return Boolean(state.isConnected && state.isInternetReachable !== false);
  } catch {
    return false;
  }
}

export function resolveEffectiveNetworkStatus(
  realStatus: boolean,
  overrideStatus: boolean | null
): boolean {
  return overrideStatus ?? realStatus;
}

