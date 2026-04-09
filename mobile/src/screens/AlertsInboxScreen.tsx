import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AlertCard from "../components/AlertCard";
import StatusBadge from "../components/StatusBadge";
import { colors, radii } from "../theme";
import type { AlertPacket } from "../types/alert";
import { ALERT_TYPE_LABELS, SEVERITY_LABELS } from "../types/alert";
import { formatTimestamp } from "../utils/time";

interface AlertsInboxScreenProps {
  alerts: AlertPacket[];
  selectedAlertId: string | null;
  onBack: () => void;
  onCreateAlert: () => void;
  onOpenRelay: (alertId: string) => void;
  onSelectAlert: (alertId: string) => void;
}

export default function AlertsInboxScreen({
  alerts,
  selectedAlertId,
  onBack,
  onCreateAlert,
  onOpenRelay,
  onSelectAlert
}: AlertsInboxScreenProps) {
  const selectedAlert = alerts.find((alert) => alert.id === selectedAlertId) ?? alerts[0] ?? null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <Pressable onPress={onCreateAlert}>
          <Text style={styles.linkText}>بلاغ جديد</Text>
        </Pressable>
        <Pressable onPress={onBack}>
          <Text style={styles.linkText}>الرئيسية</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>البلاغات المخزنة محليًا</Text>
      <Text style={styles.subtitle}>
        جميع البلاغات التالية محفوظة داخل الجهاز حتى يتم تمريرها أو مزامنتها.
      </Text>

      {alerts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>لا توجد بلاغات بعد</Text>
          <Text style={styles.emptyText}>أنشئ أول بلاغ طوارئ ليظهر هنا تلقائيًا.</Text>
        </View>
      ) : null}

      <View style={styles.list}>
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            selected={selectedAlert?.id === alert.id}
            onPress={() => onSelectAlert(alert.id)}
          />
        ))}
      </View>

      {selectedAlert ? (
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <View style={styles.detailsTitleGroup}>
              <Text style={styles.detailsTitle}>تفاصيل البلاغ</Text>
              <Text style={styles.detailsId}>{selectedAlert.id}</Text>
            </View>
            <StatusBadge label={`${selectedAlert.hopCount} hops`} tone="info" />
          </View>

          <Text style={styles.detailsText}>النوع: {ALERT_TYPE_LABELS[selectedAlert.type]}</Text>
          <Text style={styles.detailsText}>الخطورة: {SEVERITY_LABELS[selectedAlert.severity]}</Text>
          <Text style={styles.detailsText}>الحالة الحالية: {selectedAlert.status}</Text>
          <Text style={styles.detailsText}>
            الموقع:{" "}
            {selectedAlert.location.address ??
              `${selectedAlert.location.lat}, ${selectedAlert.location.lng}`}
          </Text>
          <Text style={styles.detailsText}>
            وقت الإنشاء: {formatTimestamp(selectedAlert.createdAt)}
          </Text>
          <Text style={styles.detailsText}>
            تاريخ التمرير: {selectedAlert.relayHistory.join(" ← ")}
          </Text>

          <Pressable
            onPress={() => onOpenRelay(selectedAlert.id)}
            style={({ pressed }) => [styles.openButton, pressed && styles.openButtonPressed]}
          >
            <Text style={styles.openButtonText}>فتح شاشة الحالة</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16
  },
  topBar: {
    flexDirection: "row-reverse",
    justifyContent: "space-between"
  },
  linkText: {
    color: colors.info,
    fontWeight: "700",
    writingDirection: "rtl"
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl"
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "right",
    writingDirection: "rtl"
  },
  emptyCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 20,
    gap: 8
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl"
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "right",
    writingDirection: "rtl"
  },
  list: {
    gap: 12
  },
  detailsCard: {
    backgroundColor: colors.panelElevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    padding: 18,
    gap: 10
  },
  detailsHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center"
  },
  detailsTitleGroup: {
    alignItems: "flex-end"
  },
  detailsTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    writingDirection: "rtl"
  },
  detailsId: {
    color: colors.textMuted,
    fontSize: 12
  },
  detailsText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "right",
    writingDirection: "rtl"
  },
  openButton: {
    marginTop: 6,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 15,
    alignItems: "center"
  },
  openButtonPressed: {
    opacity: 0.92
  },
  openButtonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: "800",
    writingDirection: "rtl"
  }
});
