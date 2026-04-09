import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radii, shadows } from "../theme";
import type { AlertSeverity, AlertType, CreateAlertInput } from "../types/alert";
import { ALERT_TYPE_OPTIONS, SEVERITY_OPTIONS } from "../types/alert";

interface CreateAlertScreenProps {
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (input: CreateAlertInput) => Promise<void>;
}

export default function CreateAlertScreen({
  isSubmitting,
  onBack,
  onSubmit
}: CreateAlertScreenProps) {
  const [type, setType] = useState<AlertType>("fire");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<AlertSeverity>("high");

  const isDisabled = useMemo(
    () => description.trim().length < 8 || isSubmitting,
    [description, isSubmitting]
  );

  const handleSubmit = async () => {
    if (isDisabled) {
      return;
    }

    await onSubmit({
      type,
      description,
      severity
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>العودة</Text>
      </Pressable>

      <View style={styles.headerCard}>
        <Text style={styles.title}>إنشاء بلاغ مشفّر</Text>
        <Text style={styles.description}>
          أدخل الحد الأدنى من البيانات، وسيتم جلب الموقع والوقت تلقائيًا ثم تخزين البلاغ داخل الجهاز.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>نوع البلاغ</Text>
        <View style={styles.optionsWrap}>
          {ALERT_TYPE_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setType(option.value)}
              style={[
                styles.optionChip,
                type === option.value && styles.optionChipActive
              ]}
            >
              <Text
                style={[
                  styles.optionChipText,
                  type === option.value && styles.optionChipTextActive
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>وصف مختصر</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="مثال: تصاعد دخان كثيف من مبنى سكني مع ازدحام مروري."
          placeholderTextColor={colors.textMuted}
          multiline
          textAlign="right"
          style={styles.textInput}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>مستوى الخطورة</Text>
        <View style={styles.optionsWrap}>
          {SEVERITY_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setSeverity(option.value)}
              style={[
                styles.optionChip,
                severity === option.value && styles.optionChipActive
              ]}
            >
              <Text
                style={[
                  styles.optionChipText,
                  severity === option.value && styles.optionChipTextActive
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.autoInfoCard}>
        <Text style={styles.autoInfoTitle}>سيتم تعبئتها تلقائيًا</Text>
        <Text style={styles.autoInfoItem}>الموقع: GPS أو موقع افتراضي عند التعذر</Text>
        <Text style={styles.autoInfoItem}>الوقت: لحظة إنشاء البلاغ</Text>
        <Text style={styles.autoInfoItem}>التشفير: AES-256 Mock Envelope</Text>
      </View>

      <Pressable
        disabled={isDisabled}
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.submitButton,
          isDisabled && styles.submitButtonDisabled,
          pressed && !isDisabled && styles.submitButtonPressed
        ]}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "جارٍ إنشاء البلاغ..." : "إنشاء البلاغ المشفّر"}
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
    gap: 20
  },
  backButton: {
    alignSelf: "flex-end"
  },
  backButtonText: {
    color: colors.info,
    fontSize: 14,
    fontWeight: "700",
    writingDirection: "rtl"
  },
  headerCard: {
    backgroundColor: colors.panelElevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.lg,
    padding: 22,
    gap: 10
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl"
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "right",
    writingDirection: "rtl"
  },
  section: {
    gap: 12
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right",
    writingDirection: "rtl"
  },
  optionsWrap: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10
  },
  optionChip: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  optionChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft
  },
  optionChipText: {
    color: colors.textMuted,
    fontWeight: "700",
    writingDirection: "rtl"
  },
  optionChipTextActive: {
    color: colors.accent
  },
  textInput: {
    minHeight: 120,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 16,
    color: colors.text,
    textAlignVertical: "top",
    writingDirection: "rtl",
    lineHeight: 24
  },
  autoInfoCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 18,
    gap: 10
  },
  autoInfoTitle: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl"
  },
  autoInfoItem: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "right",
    writingDirection: "rtl"
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 18,
    alignItems: "center",
    ...shadows.neon
  },
  submitButtonDisabled: {
    opacity: 0.55
  },
  submitButtonPressed: {
    opacity: 0.92
  },
  submitButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "800",
    writingDirection: "rtl"
  }
});
