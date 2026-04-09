import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { AlertPacket } from "../types/alert";
import { ALERT_TYPE_LABELS, SEVERITY_LABELS, STATUS_LABELS } from "../types/alert";
import { colors, radii } from "../theme";
import { formatTimestamp } from "../utils/time";
import StatusBadge from "./StatusBadge";

interface AlertCardProps {
  alert: AlertPacket;
  selected?: boolean;
  onPress?: () => void;
}

export default function AlertCard({ alert, onPress, selected = false }: AlertCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.idText}>{alert.id}</Text>
          <Text style={styles.titleText}>{ALERT_TYPE_LABELS[alert.type]}</Text>
        </View>
        <StatusBadge
          label={STATUS_LABELS[alert.status]}
          tone={
            alert.status === "synced"
              ? "success"
              : alert.status === "pending_relay"
                ? "warning"
                : "info"
          }
        />
      </View>

      <Text style={styles.descriptionText} numberOfLines={2}>
        {alert.description}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaItem}>الخطورة: {SEVERITY_LABELS[alert.severity]}</Text>
        <Text style={styles.metaItem}>الوقت: {formatTimestamp(alert.createdAt)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 16,
    gap: 12
  },
  cardSelected: {
    borderColor: colors.borderStrong,
    backgroundColor: colors.panelElevated
  },
  cardPressed: {
    opacity: 0.92
  },
  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  headerText: {
    flex: 1,
    alignItems: "flex-end",
    gap: 4
  },
  idText: {
    color: colors.textMuted,
    fontSize: 12,
    writingDirection: "rtl"
  },
  titleText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    writingDirection: "rtl"
  },
  descriptionText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 22
  },
  metaRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 12
  },
  metaItem: {
    color: colors.textMuted,
    fontSize: 12,
    writingDirection: "rtl"
  }
});

