import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radii } from "../theme";

type Tone = "default" | "success" | "warning" | "info";

interface StatusBadgeProps {
  label: string;
  tone?: Tone;
}

const toneStyles: Record<Tone, { backgroundColor: string; color: string }> = {
  default: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    color: colors.text
  },
  success: {
    backgroundColor: "rgba(0, 224, 138, 0.14)",
    color: colors.accent
  },
  warning: {
    backgroundColor: "rgba(255, 209, 102, 0.14)",
    color: colors.warning
  },
  info: {
    backgroundColor: "rgba(121, 207, 255, 0.14)",
    color: colors.info
  }
};

export default function StatusBadge({ label, tone = "default" }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: toneStyles[tone].backgroundColor }]}>
      <Text style={[styles.label, { color: toneStyles[tone].color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.sm
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    writingDirection: "rtl"
  }
});

