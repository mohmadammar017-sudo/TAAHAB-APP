import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DeviceNode from "../components/DeviceNode";
import StatusBadge from "../components/StatusBadge";
import { colors, radii, shadows } from "../theme";
import type { AlertPacket } from "../types/alert";
import { ALERT_TYPE_LABELS, SEVERITY_LABELS, STATUS_LABELS } from "../types/alert";
import type { MeshDevice } from "../types/device";
import { formatTimestamp } from "../utils/time";

interface RelayStatusScreenProps {
  alert: AlertPacket | null;
  devices: MeshDevice[];
  nearbyDevice: MeshDevice | null;
  isConnected: boolean;
  searching: boolean;
  apiBaseUrl: string;
  onBackHome: () => void;
  onOpenInbox: () => void;
  onStartSearch: () => Promise<void>;
  onSimulateFoundDevice: () => Promise<void>;
  onRelayAlert: () => Promise<void>;
  onSimulateInternet: () => Promise<void>;
  onUploadAlerts: () => Promise<void>;
}

function ActionButton({
  label,
  onPress,
  primary = false
}: {
  label: string;
  onPress: () => void | Promise<void>;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        primary ? styles.actionButtonPrimary : styles.actionButtonSecondary,
        pressed && styles.actionButtonPressed
      ]}
    >
      <Text
        style={[
          styles.actionButtonText,
          primary ? styles.actionButtonTextPrimary : styles.actionButtonTextSecondary
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function RelayStatusScreen({
  alert,
  devices,
  nearbyDevice,
  isConnected,
  searching,
  apiBaseUrl,
  onBackHome,
  onOpenInbox,
  onStartSearch,
  onSimulateFoundDevice,
  onRelayAlert,
  onSimulateInternet,
  onUploadAlerts
}: RelayStatusScreenProps) {
  if (!alert) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>لا يوجد بلاغ محدد</Text>
        <Text style={styles.emptyStateText}>
          أنشئ بلاغًا جديدًا أو افتح قائمة البلاغات المخزنة.
        </Text>
        <ActionButton label="العودة للرئيسية" onPress={onBackHome} primary />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topActions}>
        <Pressable onPress={onOpenInbox}>
          <Text style={styles.linkText}>قائمة البلاغات</Text>
        </Pressable>
        <Pressable onPress={onBackHome}>
          <Text style={styles.linkText}>الرئيسية</Text>
        </Pressable>
      </View>

      <View style={styles.packetCard}>
        <View style={styles.packetHeader}>
          <View style={styles.packetHeaderText}>
            <Text style={styles.packetTitle}>الحزمة الآمنة</Text>
            <Text style={styles.packetId}>{alert.id}</Text>
          </View>
          <StatusBadge
            label={STATUS_LABELS[alert.status]}
            tone={alert.status === "synced" ? "success" : "info"}
          />
        </View>

        <View style={styles.packetGrid}>
          <Text style={styles.packetMeta}>النوع: {ALERT_TYPE_LABELS[alert.type]}</Text>
          <Text style={styles.packetMeta}>الخطورة: {SEVERITY_LABELS[alert.severity]}</Text>
          <Text style={styles.packetMeta}>الموقع: {alert.location.address ?? "غير متاح"}</Text>
          <Text style={styles.packetMeta}>التشفير: {alert.encryptionLabel}</Text>
          <Text style={styles.packetMeta}>آخر تحديث: {formatTimestamp(alert.lastUpdatedAt)}</Text>
          <Text style={styles.packetMeta}>عدد مرات التمرير: {alert.hopCount}</Text>
        </View>

        <Text style={styles.packetDescription}>{alert.description}</Text>

        <View style={styles.statusFlags}>
          <StatusBadge
            label={nearbyDevice ? `قريب: ${nearbyDevice.name}` : "لا يوجد جهاز قريب"}
            tone={nearbyDevice ? "info" : "default"}
          />
          <StatusBadge
            label={isConnected ? "الإنترنت متاح" : "بدون إنترنت"}
            tone={isConnected ? "success" : "warning"}
          />
        </View>
      </View>

      <View style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>أدوات التجربة</Text>
        <View style={styles.actionsGrid}>
          <ActionButton
            label={searching ? "جارٍ البحث..." : "بدء البحث عن أجهزة قريبة"}
            onPress={onStartSearch}
          />
          <ActionButton label="محاكاة العثور على جهاز" onPress={onSimulateFoundDevice} />
          <ActionButton label="تمرير البلاغ" onPress={onRelayAlert} primary />
          <ActionButton label="محاكاة وجود إنترنت" onPress={onSimulateInternet} />
          <ActionButton label="رفع البلاغ للسيرفر" onPress={onUploadAlerts} primary />
        </View>
        <Text style={styles.apiHint}>Endpoint: {apiBaseUrl}/api/alerts</Text>
      </View>

      <View style={styles.networkCard}>
        <Text style={styles.sectionTitle}>مسار الشبكة المحلية</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.devicesRow}
        >
          {devices.map((device, index) => (
            <React.Fragment key={device.id}>
              <DeviceNode
                device={device}
                isCurrent={alert.currentDeviceId === device.id}
                isNearby={nearbyDevice?.id === device.id}
              />
              {index < devices.length - 1 ? <View style={styles.connectionLine} /> : null}
            </React.Fragment>
          ))}

          <View style={styles.operationsNode}>
            <Text style={styles.operationsTitle}>غرفة العمليات</Text>
            <StatusBadge
              label={alert.status === "synced" ? "تم الاستلام" : "بانتظار الرفع"}
              tone={alert.status === "synced" ? "success" : "warning"}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.logCard}>
        <Text style={styles.sectionTitle}>سجل الأحداث الحي</Text>
        <View style={styles.logList}>
          {alert.logs.map((entry) => (
            <View key={entry.id} style={styles.logItem}>
              <View
                style={[
                  styles.logDot,
                  {
                    backgroundColor:
                      entry.level === "success"
                        ? colors.accent
                        : entry.level === "warning"
                          ? colors.warning
                          : colors.info
                  }
                ]}
              />
              <View style={styles.logTextWrapper}>
                <Text style={styles.logText}>{entry.message}</Text>
                <Text style={styles.logTimestamp}>{formatTimestamp(entry.timestamp)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
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
    gap: 18
  },
  topActions: {
    flexDirection: "row-reverse",
    justifyContent: "space-between"
  },
  linkText: {
    color: colors.info,
    fontWeight: "700",
    writingDirection: "rtl"
  },
  packetCard: {
    backgroundColor: colors.panelElevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.lg,
    padding: 22,
    gap: 14,
    ...shadows.neon
  },
  packetHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  packetHeaderText: {
    flex: 1,
    alignItems: "flex-end"
  },
  packetTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    writingDirection: "rtl"
  },
  packetId: {
    color: colors.textMuted,
    fontSize: 13
  },
  packetGrid: {
    gap: 8
  },
  packetMeta: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "right",
    writingDirection: "rtl"
  },
  packetDescription: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "right",
    writingDirection: "rtl"
  },
  statusFlags: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10
  },
  actionsCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 18,
    gap: 14
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl"
  },
  actionsGrid: {
    gap: 12
  },
  actionButton: {
    borderRadius: radii.md,
    paddingVertical: 15,
    alignItems: "center"
  },
  actionButtonPrimary: {
    backgroundColor: colors.accent
  },
  actionButtonSecondary: {
    backgroundColor: colors.panelMuted,
    borderWidth: 1,
    borderColor: colors.border
  },
  actionButtonPressed: {
    opacity: 0.92
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "800",
    writingDirection: "rtl"
  },
  actionButtonTextPrimary: {
    color: colors.background
  },
  actionButtonTextSecondary: {
    color: colors.text
  },
  apiHint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "right"
  },
  networkCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 18,
    gap: 14
  },
  devicesRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12
  },
  connectionLine: {
    width: 36,
    height: 2,
    backgroundColor: colors.borderStrong
  },
  operationsNode: {
    width: 180,
    backgroundColor: colors.panelElevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    padding: 16,
    gap: 12
  },
  operationsTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl"
  },
  logCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 18,
    gap: 14
  },
  logList: {
    gap: 12
  },
  logItem: {
    flexDirection: "row-reverse",
    gap: 12,
    alignItems: "flex-start"
  },
  logDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginTop: 6
  },
  logTextWrapper: {
    flex: 1,
    gap: 4,
    alignItems: "flex-end"
  },
  logText: {
    color: colors.text,
    fontSize: 14,
    textAlign: "right",
    writingDirection: "rtl"
  },
  logTimestamp: {
    color: colors.textMuted,
    fontSize: 12
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 16
  },
  emptyStateTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    writingDirection: "rtl"
  },
  emptyStateText: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    writingDirection: "rtl"
  }
});
