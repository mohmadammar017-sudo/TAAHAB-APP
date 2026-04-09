import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import StatusBadge from "../components/StatusBadge";
import { colors, radii, shadows } from "../theme";

interface HomeScreenProps {
  isConnected: boolean;
  networkModeLabel: string;
  pendingAlertsCount: number;
  onCreateAlert: () => void;
  onOpenInbox: () => void;
  onToggleConnectivity: () => void;
}

export default function HomeScreen({
  isConnected,
  networkModeLabel,
  pendingAlertsCount,
  onCreateAlert,
  onOpenInbox,
  onToggleConnectivity
}: HomeScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.overline}>Offline Emergency Relay Feature</Text>
        <Text style={styles.title}>تأهّب</Text>
        <Text style={styles.subtitle}>بلاغ طوارئ يعمل حتى عند انقطاع الشبكة</Text>
        <Text style={styles.description}>
          أنشئ البلاغ، خزّنه محليًا، مرّره بين الأجهزة القريبة، وارفعه لاحقًا عندما يظهر الاتصال.
        </Text>

        <View style={styles.statusRow}>
          <StatusBadge
            label={isConnected ? "متصل" : "غير متصل"}
            tone={isConnected ? "success" : "warning"}
          />
          <StatusBadge label={`وضع ${networkModeLabel}`} tone="info" />
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{pendingAlertsCount}</Text>
          <Text style={styles.metricLabel}>بلاغات معلّقة</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={[styles.metricValue, { color: isConnected ? colors.accent : colors.warning }]}>
            {isConnected ? "UP" : "OFF"}
          </Text>
          <Text style={styles.metricLabel}>حالة الشبكة</Text>
        </View>
      </View>

      <Pressable
        onPress={onCreateAlert}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
      >
        <Text style={styles.primaryButtonText}>إنشاء بلاغ طوارئ</Text>
      </Pressable>

      <Pressable
        onPress={onOpenInbox}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
      >
        <Text style={styles.secondaryButtonText}>عرض البلاغات المخزنة</Text>
      </Pressable>

      <Pressable
        onPress={onToggleConnectivity}
        style={({ pressed }) => [styles.inlineAction, pressed && styles.buttonPressed]}
      >
        <Text style={styles.inlineActionText}>
          {isConnected ? "محاكاة انقطاع الشبكة" : "محاكاة عودة الاتصال"}
        </Text>
      </Pressable>
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
  heroCard: {
    backgroundColor: colors.panelElevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.lg,
    padding: 24,
    gap: 12,
    ...shadows.neon
  },
  overline: {
    color: colors.accent,
    fontSize: 12,
    letterSpacing: 1.2,
    textAlign: "right"
  },
  title: {
    color: colors.text,
    fontSize: 38,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl"
  },
  subtitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right",
    writingDirection: "rtl"
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "right",
    writingDirection: "rtl"
  },
  statusRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8
  },
  metricsRow: {
    flexDirection: "row-reverse",
    gap: 12
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 18,
    alignItems: "flex-end",
    gap: 8
  },
  metricValue: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800"
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 13,
    writingDirection: "rtl"
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 18,
    alignItems: "center",
    ...shadows.neon
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: "800",
    writingDirection: "rtl"
  },
  secondaryButton: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 18,
    alignItems: "center"
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    writingDirection: "rtl"
  },
  inlineAction: {
    alignItems: "center",
    paddingVertical: 14
  },
  inlineActionText: {
    color: colors.info,
    fontSize: 14,
    fontWeight: "700",
    writingDirection: "rtl"
  },
  buttonPressed: {
    opacity: 0.9
  }
});

