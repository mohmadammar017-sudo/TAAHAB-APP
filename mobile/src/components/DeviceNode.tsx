import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { MeshDevice } from "../types/device";
import { colors, radii } from "../theme";
import StatusBadge from "./StatusBadge";

interface DeviceNodeProps {
  device: MeshDevice;
  isCurrent?: boolean;
  isNearby?: boolean;
}

export default function DeviceNode({
  device,
  isCurrent = false,
  isNearby = false
}: DeviceNodeProps) {
  return (
    <View
      style={[
        styles.card,
        isCurrent && styles.currentCard,
        isNearby && styles.nearbyCard
      ]}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: device.hasInternet ? colors.accent : colors.warning }
          ]}
        />
        <Text style={styles.title}>{device.name}</Text>
      </View>

      <Text style={styles.meta}>المعرّف: {device.id}</Text>
      <Text style={styles.meta}>البطارية: {device.batteryLevel ?? 0}%</Text>

      <View style={styles.badgeRow}>
        <StatusBadge
          label={device.hasInternet ? "متصل" : "بدون إنترنت"}
          tone={device.hasInternet ? "success" : "warning"}
        />
        <StatusBadge
          label={device.isReachable ? "قريب" : "غير نشط"}
          tone={device.isReachable ? "info" : "default"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 16,
    gap: 12
  },
  currentCard: {
    borderColor: colors.borderStrong,
    backgroundColor: colors.panelElevated
  },
  nearbyCard: {
    shadowColor: colors.info,
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4
  },
  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center"
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 10
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    writingDirection: "rtl"
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
    writingDirection: "rtl",
    textAlign: "right"
  },
  badgeRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8
  }
});
