import * as Location from "expo-location";
import type { AlertLocation } from "../types/alert";

const FALLBACK_LOCATION: AlertLocation = {
  lat: 24.746111,
  lng: 46.655555,
  address: "حي النخيل - الرياض"
};

export async function getCurrentLocation(): Promise<AlertLocation> {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
      return FALLBACK_LOCATION;
    }

    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced
    });

    let address = FALLBACK_LOCATION.address;

    try {
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude
      });

      if (geo) {
        address = [geo.district, geo.city || geo.region].filter(Boolean).join(" - ");
      }
    } catch {
      address = FALLBACK_LOCATION.address;
    }

    return {
      lat: current.coords.latitude,
      lng: current.coords.longitude,
      address
    };
  } catch {
    return FALLBACK_LOCATION;
  }
}

