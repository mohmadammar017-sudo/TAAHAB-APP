export interface MeshDevice {
  id: string;
  name: string;
  batteryLevel?: number;
  hasInternet: boolean;
  isReachable: boolean;
  lastSeenAt: string;
}

