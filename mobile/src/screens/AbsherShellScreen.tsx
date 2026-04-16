import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { AlertPacket } from "../types/alert";
import { ALERT_TYPE_LABELS, SEVERITY_LABELS, STATUS_LABELS } from "../types/alert";
import { formatTimestamp } from "../utils/time";

export type AbsherTabKey = "home" | "services" | "documents" | "more";

interface AbsherShellScreenProps {
  activeTab: AbsherTabKey;
  isConnected: boolean;
  pendingAlertsCount: number;
  latestAlert: AlertPacket | null;
  onChangeTab: (tab: AbsherTabKey) => void;
  onOpenTaahab: () => void;
  onCreateAlert: () => void;
  onOpenInbox: () => void;
  onOpenLatestAlert: () => void;
  onToggleConnectivity: () => void;
}

const shellColors = {
  background: "#F3F6F4",
  surface: "#FFFFFF",
  surfaceSoft: "#F8FBF9",
  border: "#DEE8E1",
  borderStrong: "#C8D8CF",
  text: "#102117",
  textMuted: "#6B7C72",
  primary: "#006C35",
  primarySoft: "#EAF5EE",
  primaryStrong: "#0A7A44",
  danger: "#D6614C",
  info: "#276EF1",
  gold: "#B58A3E",
  shadow: "rgba(16, 33, 23, 0.08)"
} as const;

const tabs: Array<{ key: AbsherTabKey; label: string; short: string }> = [
  { key: "home", label: "الرئيسية", short: "رس" },
  { key: "services", label: "الخدمات", short: "خد" },
  { key: "documents", label: "وثائقي", short: "وث" },
  { key: "more", label: "المزيد", short: "زي" }
];

export default function AbsherShellScreen({
  activeTab,
  isConnected,
  pendingAlertsCount,
  latestAlert,
  onChangeTab,
  onOpenTaahab,
  onCreateAlert,
  onOpenInbox,
  onOpenLatestAlert,
  onToggleConnectivity
}: AbsherShellScreenProps) {
  return (
    <View style={styles.root}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerActions}>
            <GhostButton label="⚙" />
            <GhostButton label="!" />
          </View>

          <View style={styles.logoGroup}>
            <View style={styles.logoMark}>
              <View style={styles.logoPalm} />
              <View style={styles.logoSwordRight} />
              <View style={styles.logoSwordLeft} />
            </View>
            <View style={styles.logoTextGroup}>
              <Text style={styles.logoText}>أبشر</Text>
              <Text style={styles.logoSubtext}>منصة خدمات رقمية متكاملة</Text>
            </View>
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>مع</Text>
          </View>

          <View style={styles.profileBody}>
            <Text style={styles.profileGreeting}>مرحبًا بك</Text>
            <Text style={styles.profileName}>محمد عمّار</Text>
            <Text style={styles.profileMeta}>هوية رقمية نشطة · 1146677893</Text>
          </View>
        </View>

        <View style={styles.searchCard}>
          <Text style={styles.searchHint}>ابحث عن خدمة أو مستند أو ميزة طوارئ</Text>
          <View style={styles.searchBadge}>
            <Text style={styles.searchBadgeText}>بحث</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <InfoChip
            label={isConnected ? "الشبكة متصلة" : "الشبكة غير متصلة"}
            tone={isConnected ? "success" : "warning"}
          />
          <InfoChip label={`${pendingAlertsCount} بلاغات معلقة`} tone="neutral" />
        </View>

        {activeTab === "home" ? (
          <HomeTabContent
            isConnected={isConnected}
            pendingAlertsCount={pendingAlertsCount}
            latestAlert={latestAlert}
            onCreateAlert={onCreateAlert}
            onOpenInbox={onOpenInbox}
            onOpenLatestAlert={onOpenLatestAlert}
            onOpenTaahab={onOpenTaahab}
            onToggleConnectivity={onToggleConnectivity}
          />
        ) : null}

        {activeTab === "services" ? (
          <ServicesTabContent
            pendingAlertsCount={pendingAlertsCount}
            onCreateAlert={onCreateAlert}
            onOpenInbox={onOpenInbox}
            onOpenTaahab={onOpenTaahab}
          />
        ) : null}

        {activeTab === "documents" ? (
          <DocumentsTabContent
            pendingAlertsCount={pendingAlertsCount}
            latestAlert={latestAlert}
            onOpenInbox={onOpenInbox}
            onOpenLatestAlert={onOpenLatestAlert}
          />
        ) : null}

        {activeTab === "more" ? (
          <MoreTabContent
            isConnected={isConnected}
            onOpenTaahab={onOpenTaahab}
            onToggleConnectivity={onToggleConnectivity}
          />
        ) : null}
      </ScrollView>

      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <Pressable
              key={tab.key}
              onPress={() => onChangeTab(tab.key)}
              style={({ pressed }) => [styles.tabButton, active && styles.tabButtonActive, pressed && styles.pressed]}
            >
              <View style={[styles.tabIcon, active && styles.tabIconActive]}>
                <Text style={[styles.tabIconText, active && styles.tabIconTextActive]}>{tab.short}</Text>
              </View>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function HomeTabContent({
  isConnected,
  pendingAlertsCount,
  latestAlert,
  onCreateAlert,
  onOpenInbox,
  onOpenLatestAlert,
  onOpenTaahab,
  onToggleConnectivity
}: {
  isConnected: boolean;
  pendingAlertsCount: number;
  latestAlert: AlertPacket | null;
  onCreateAlert: () => void;
  onOpenInbox: () => void;
  onOpenLatestAlert: () => void;
  onOpenTaahab: () => void;
  onToggleConnectivity: () => void;
}) {
  return (
    <View style={styles.sectionStack}>
      <View style={styles.heroCard}>
        <View style={styles.heroOrbLarge} />
        <View style={styles.heroOrbSmall} />

        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>ميزة طوارئ ضمن التطبيق</Text>
        </View>

        <Text style={styles.heroEyebrow}>الوصول السريع</Text>
        <Text style={styles.heroTitle}>تأهّب</Text>
        <Text style={styles.heroDescription}>
          بلاغ طوارئ مشفّر يعمل حتى عند انقطاع الشبكة، ويمكن الوصول إليه مباشرة عند هزّ الجوال.
        </Text>

        <View style={styles.heroStatusRow}>
          <InfoChip label="Offline Ready" tone="success" compact />
          <InfoChip label="Mesh Relay" tone="neutral" compact />
          <InfoChip label={`${pendingAlertsCount} Pending`} tone="warning" compact />
        </View>

        <View style={styles.heroActions}>
          <ActionButton label="فتح تأهّب" primary onPress={onOpenTaahab} />
          <ActionButton label="بلاغ جديد" onPress={onCreateAlert} />
        </View>
      </View>

      <SectionHeader title="وثائقي الرقمية" actionLabel="صندوق البلاغات" onPress={onOpenInbox} />

      <View style={styles.twoColumnGrid}>
        <DocumentCard
          title="الهوية الرقمية"
          subtitle="جاهزة للاستعراض والتحقق"
          monogram="هو"
          tone="green"
        />
        <DocumentCard
          title="رخصة القيادة"
          subtitle="مستند رقمي محدث"
          monogram="رخ"
          tone="gold"
        />
      </View>

      <SectionHeader title="الوصول السريع" />

      <FeatureRowCard
        title={latestAlert ? "آخر بلاغ طوارئ" : "حالة تأهّب"}
        description={
          latestAlert
            ? `${ALERT_TYPE_LABELS[latestAlert.type]} · ${STATUS_LABELS[latestAlert.status]} · ${formatTimestamp(latestAlert.lastUpdatedAt)}`
            : "لا توجد بلاغات نشطة حاليًا. يمكنك فتح تأهّب أو إنشاء بلاغ جديد مباشرة."
        }
        actionLabel={latestAlert ? "متابعة البلاغ" : "فتح تأهّب"}
        monogram={latestAlert ? "بل" : "ته"}
        tone="green"
        onPress={latestAlert ? onOpenLatestAlert : onOpenTaahab}
      />

      <FeatureRowCard
        title="محاكاة الاتصال"
        description={
          isConnected
            ? "الجهاز متصل حاليًا. اضغط لمحاكاة انقطاع الشبكة وتجربة منطق الترحيل."
            : "الجهاز يعمل حاليًا بدون اتصال. اضغط لمحاكاة عودة الإنترنت."
        }
        actionLabel={isConnected ? "محاكاة الانقطاع" : "محاكاة العودة"}
        monogram="شب"
        tone="blue"
        onPress={onToggleConnectivity}
      />
    </View>
  );
}

function ServicesTabContent({
  pendingAlertsCount,
  onCreateAlert,
  onOpenInbox,
  onOpenTaahab
}: {
  pendingAlertsCount: number;
  onCreateAlert: () => void;
  onOpenInbox: () => void;
  onOpenTaahab: () => void;
}) {
  return (
    <View style={styles.sectionStack}>
      <SectionHeader title="الخدمات السريعة" />

      <View style={styles.twoColumnGrid}>
        <ServiceTile
          title="تأهّب"
          subtitle="بلاغ طوارئ يعمل دون إنترنت"
          monogram="ته"
          tone="green"
          badge={pendingAlertsCount > 0 ? `${pendingAlertsCount}` : "جاهز"}
          onPress={onOpenTaahab}
        />
        <ServiceTile
          title="بلاغ جديد"
          subtitle="إنشاء بلاغ مشفّر"
          monogram="جد"
          tone="blue"
          onPress={onCreateAlert}
        />
        <ServiceTile
          title="الحافظة المحلية"
          subtitle="استعراض البلاغات المخزنة"
          monogram="حف"
          tone="neutral"
          onPress={onOpenInbox}
        />
        <ServiceTile
          title="مركباتي"
          subtitle="لوحة مركبات ورخص"
          monogram="مر"
          tone="gold"
          onPress={() => undefined}
        />
        <ServiceTile
          title="وثائقي"
          subtitle="مستندات رقمية آمنة"
          monogram="وث"
          tone="neutral"
          onPress={() => undefined}
        />
        <ServiceTile
          title="مواعيدي"
          subtitle="متابعة الحالات والخدمات"
          monogram="مع"
          tone="blue"
          onPress={() => undefined}
        />
      </View>
    </View>
  );
}

function DocumentsTabContent({
  pendingAlertsCount,
  latestAlert,
  onOpenInbox,
  onOpenLatestAlert
}: {
  pendingAlertsCount: number;
  latestAlert: AlertPacket | null;
  onOpenInbox: () => void;
  onOpenLatestAlert: () => void;
}) {
  return (
    <View style={styles.sectionStack}>
      <SectionHeader title="المستندات والمحفظة الرقمية" />

      <FeatureRowCard
        title="الهوية الرقمية"
        description="جاهزة للمشاركة السريعة داخل التطبيق وعبر رمز الاستجابة."
        actionLabel="عرض"
        monogram="هو"
        tone="green"
        onPress={() => undefined}
      />

      <FeatureRowCard
        title="رخصة القيادة"
        description="نسخة رقمية محدثة تتماشى مع الهوية الرقمية."
        actionLabel="عرض"
        monogram="رخ"
        tone="gold"
        onPress={() => undefined}
      />

      <FeatureRowCard
        title="حافظة البلاغات المحلية"
        description={`يوجد ${pendingAlertsCount} بلاغات محفوظة محليًا وجاهزة للتمرير أو الرفع.`}
        actionLabel="فتح الحافظة"
        monogram="حف"
        tone="blue"
        onPress={onOpenInbox}
      />

      {latestAlert ? (
        <View style={styles.alertSnapshotCard}>
          <Text style={styles.alertSnapshotTitle}>آخر حزمة طوارئ</Text>
          <Text style={styles.alertSnapshotMeta}>النوع: {ALERT_TYPE_LABELS[latestAlert.type]}</Text>
          <Text style={styles.alertSnapshotMeta}>الخطورة: {SEVERITY_LABELS[latestAlert.severity]}</Text>
          <Text style={styles.alertSnapshotMeta}>الحالة: {STATUS_LABELS[latestAlert.status]}</Text>

          <Pressable onPress={onOpenLatestAlert} style={({ pressed }) => [styles.inlineLink, pressed && styles.pressed]}>
            <Text style={styles.inlineLinkText}>متابعة البلاغ من تأهّب</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function MoreTabContent({
  isConnected,
  onOpenTaahab,
  onToggleConnectivity
}: {
  isConnected: boolean;
  onOpenTaahab: () => void;
  onToggleConnectivity: () => void;
}) {
  return (
    <View style={styles.sectionStack}>
      <SectionHeader title="إعدادات ومعلومات" />

      <FeatureRowCard
        title="اختصار الهزّ"
        description="عند هزّ الجوال من الواجهة الرئيسية، يتم فتح ميزة تأهّب مباشرة للوصول السريع وقت الطوارئ."
        actionLabel="فتح تأهّب"
        monogram="هز"
        tone="green"
        onPress={onOpenTaahab}
      />

      <FeatureRowCard
        title="حالة الشبكة"
        description={isConnected ? "الاتصال متاح حاليًا على هذا الجهاز." : "الجهاز يعمل الآن بدون اتصال."}
        actionLabel={isConnected ? "محاكاة الانقطاع" : "محاكاة العودة"}
        monogram="شب"
        tone="blue"
        onPress={onToggleConnectivity}
      />

      <FeatureRowCard
        title="قصة العرض أمام اللجنة"
        description="ابدأ من أبشر، ثم هزّ الجوال لفتح تأهّب، أنشئ البلاغ، مرّره محليًا، ثم ارفعه لاحقًا عند توفر الإنترنت."
        actionLabel="جاهز للعرض"
        monogram="عر"
        tone="neutral"
        onPress={() => undefined}
      />
    </View>
  );
}

function SectionHeader({
  title,
  actionLabel,
  onPress
}: {
  title: string;
  actionLabel?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      {actionLabel && onPress ? (
        <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
          <Text style={styles.sectionHeaderAction}>{actionLabel}</Text>
        </Pressable>
      ) : (
        <View />
      )}
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
    </View>
  );
}

function DocumentCard({
  title,
  subtitle,
  monogram,
  tone
}: {
  title: string;
  subtitle: string;
  monogram: string;
  tone: "green" | "gold";
}) {
  return (
    <View style={[styles.documentCard, tone === "green" ? styles.documentCardGreen : styles.documentCardGold]}>
      <View style={[styles.monogramBadge, tone === "green" ? styles.monogramGreen : styles.monogramGold]}>
        <Text style={[styles.monogramText, { color: tone === "green" ? shellColors.primary : shellColors.gold }]}>{monogram}</Text>
      </View>
      <Text style={styles.documentTitle}>{title}</Text>
      <Text style={styles.documentSubtitle}>{subtitle}</Text>
    </View>
  );
}

function ServiceTile({
  title,
  subtitle,
  monogram,
  tone,
  badge,
  onPress
}: {
  title: string;
  subtitle: string;
  monogram: string;
  tone: "green" | "blue" | "gold" | "neutral";
  badge?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.serviceTile, pressed && styles.pressed]}>
      <View style={[styles.monogramBadge, toneStyles[tone].badge]}>
        <Text style={[styles.monogramText, toneStyles[tone].badgeText]}>{monogram}</Text>
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceSubtitle}>{subtitle}</Text>
      {badge ? (
        <View style={[styles.serviceBadge, toneStyles[tone].serviceBadge]}>
          <Text style={[styles.serviceBadgeText, toneStyles[tone].serviceBadgeText]}>{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

function FeatureRowCard({
  title,
  description,
  actionLabel,
  monogram,
  tone,
  onPress
}: {
  title: string;
  description: string;
  actionLabel: string;
  monogram: string;
  tone: "green" | "blue" | "gold" | "neutral";
  onPress: () => void;
}) {
  return (
    <View style={styles.featureRowCard}>
      <View style={styles.featureRowContent}>
        <Text style={styles.featureRowTitle}>{title}</Text>
        <Text style={styles.featureRowDescription}>{description}</Text>

        <Pressable onPress={onPress} style={({ pressed }) => [styles.inlineActionButton, pressed && styles.pressed]}>
          <Text style={[styles.inlineActionButtonText, toneStyles[tone].inlineActionText]}>{actionLabel}</Text>
        </Pressable>
      </View>

      <View style={[styles.featureRowBadge, toneStyles[tone].badge]}>
        <Text style={[styles.monogramText, toneStyles[tone].badgeText]}>{monogram}</Text>
      </View>
    </View>
  );
}

function InfoChip({
  label,
  tone,
  compact = false
}: {
  label: string;
  tone: "success" | "warning" | "neutral";
  compact?: boolean;
}) {
  const chipStyle =
    tone === "success"
      ? styles.infoChipSuccess
      : tone === "warning"
        ? styles.infoChipWarning
        : styles.infoChipNeutral;

  const textStyle =
    tone === "success"
      ? styles.infoChipTextSuccess
      : tone === "warning"
        ? styles.infoChipTextWarning
        : styles.infoChipTextNeutral;

  return (
    <View style={[styles.infoChip, compact && styles.infoChipCompact, chipStyle]}>
      <Text style={[styles.infoChipText, textStyle]}>{label}</Text>
    </View>
  );
}

function ActionButton({
  label,
  primary = false,
  onPress
}: {
  label: string;
  primary?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.heroActionButton,
        primary ? styles.heroActionButtonPrimary : styles.heroActionButtonSecondary,
        pressed && styles.pressed
      ]}
    >
      <Text style={[styles.heroActionButtonText, primary && styles.heroActionButtonTextPrimary]}>
        {label}
      </Text>
    </Pressable>
  );
}

function GhostButton({ label }: { label: string }) {
  return (
    <Pressable onPress={() => undefined} style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed]}>
      <Text style={styles.ghostButtonText}>{label}</Text>
    </Pressable>
  );
}

const toneStyles = {
  green: {
    badge: {
      backgroundColor: shellColors.primarySoft
    },
    badgeText: {
      color: shellColors.primary
    },
    serviceBadge: {
      backgroundColor: shellColors.primarySoft
    },
    serviceBadgeText: {
      color: shellColors.primary
    },
    inlineActionText: {
      color: shellColors.primary
    }
  },
  blue: {
    badge: {
      backgroundColor: "#EEF4FF"
    },
    badgeText: {
      color: shellColors.info
    },
    serviceBadge: {
      backgroundColor: "#EEF4FF"
    },
    serviceBadgeText: {
      color: shellColors.info
    },
    inlineActionText: {
      color: shellColors.info
    }
  },
  gold: {
    badge: {
      backgroundColor: "#FBF4E6"
    },
    badgeText: {
      color: shellColors.gold
    },
    serviceBadge: {
      backgroundColor: "#FBF4E6"
    },
    serviceBadgeText: {
      color: shellColors.gold
    },
    inlineActionText: {
      color: shellColors.gold
    }
  },
  neutral: {
    badge: {
      backgroundColor: "#EFF3F1"
    },
    badgeText: {
      color: shellColors.text
    },
    serviceBadge: {
      backgroundColor: "#EFF3F1"
    },
    serviceBadgeText: {
      color: shellColors.text
    },
    inlineActionText: {
      color: shellColors.text
    }
  }
} as const;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: shellColors.background
  },
  scrollView: {
    flex: 1
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 120,
    gap: 18
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerActions: {
    flexDirection: "row-reverse",
    gap: 10
  },
  ghostButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.78)",
    borderWidth: 1,
    borderColor: shellColors.border,
    alignItems: "center",
    justifyContent: "center"
  },
  ghostButtonText: {
    color: shellColors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  logoGroup: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10
  },
  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: shellColors.surface,
    borderWidth: 1,
    borderColor: shellColors.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden"
  },
  logoPalm: {
    width: 10,
    height: 18,
    borderRadius: 10,
    backgroundColor: shellColors.primary,
    position: "absolute",
    top: 9
  },
  logoSwordLeft: {
    width: 2,
    height: 18,
    borderRadius: 2,
    backgroundColor: shellColors.primary,
    position: "absolute",
    bottom: 6,
    left: 13,
    transform: [{ rotate: "-22deg" }]
  },
  logoSwordRight: {
    width: 2,
    height: 18,
    borderRadius: 2,
    backgroundColor: shellColors.primary,
    position: "absolute",
    bottom: 6,
    right: 13,
    transform: [{ rotate: "22deg" }]
  },
  logoTextGroup: {
    alignItems: "flex-end"
  },
  logoText: {
    color: shellColors.text,
    fontSize: 24,
    fontWeight: "900",
    writingDirection: "rtl"
  },
  logoSubtext: {
    color: shellColors.textMuted,
    fontSize: 11,
    writingDirection: "rtl"
  },
  profileCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 14,
    backgroundColor: shellColors.surface,
    borderWidth: 1,
    borderColor: shellColors.border,
    borderRadius: 26,
    padding: 18,
    shadowColor: shellColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5
  },
  profileAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: shellColors.primarySoft,
    borderWidth: 1,
    borderColor: "#D7EADF",
    alignItems: "center",
    justifyContent: "center"
  },
  profileAvatarText: {
    color: shellColors.primary,
    fontSize: 18,
    fontWeight: "900",
    writingDirection: "rtl"
  },
  profileBody: {
    flex: 1,
    alignItems: "flex-end",
    gap: 2
  },
  profileGreeting: {
    color: shellColors.textMuted,
    fontSize: 12,
    writingDirection: "rtl"
  },
  profileName: {
    color: shellColors.text,
    fontSize: 20,
    fontWeight: "900",
    writingDirection: "rtl"
  },
  profileMeta: {
    color: shellColors.textMuted,
    fontSize: 12,
    writingDirection: "rtl"
  },
  searchCard: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: shellColors.surface,
    borderWidth: 1,
    borderColor: shellColors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15
  },
  searchHint: {
    flex: 1,
    color: shellColors.textMuted,
    fontSize: 13,
    textAlign: "right",
    writingDirection: "rtl"
  },
  searchBadge: {
    backgroundColor: shellColors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999
  },
  searchBadgeText: {
    color: shellColors.primary,
    fontSize: 12,
    fontWeight: "800",
    writingDirection: "rtl"
  },
  summaryRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10
  },
  infoChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  infoChipCompact: {
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  infoChipSuccess: {
    backgroundColor: shellColors.primarySoft
  },
  infoChipWarning: {
    backgroundColor: "#FFF3EF"
  },
  infoChipNeutral: {
    backgroundColor: "#EFF3F1"
  },
  infoChipText: {
    fontSize: 12,
    fontWeight: "800",
    writingDirection: "rtl"
  },
  infoChipTextSuccess: {
    color: shellColors.primary
  },
  infoChipTextWarning: {
    color: shellColors.danger
  },
  infoChipTextNeutral: {
    color: shellColors.text
  },
  sectionStack: {
    gap: 16
  },
  heroCard: {
    backgroundColor: shellColors.primaryStrong,
    borderRadius: 28,
    padding: 22,
    overflow: "hidden",
    gap: 12
  },
  heroOrbLarge: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    top: -70,
    left: -60
  },
  heroOrbSmall: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    bottom: -20,
    right: -18
  },
  heroBadge: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  heroBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    writingDirection: "rtl"
  },
  heroEyebrow: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    textAlign: "right",
    writingDirection: "rtl"
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl"
  },
  heroDescription: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    lineHeight: 24,
    textAlign: "right",
    writingDirection: "rtl"
  },
  heroStatusRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8
  },
  heroActions: {
    flexDirection: "row-reverse",
    gap: 10,
    marginTop: 4
  },
  heroActionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 15
  },
  heroActionButtonPrimary: {
    backgroundColor: "#FFFFFF"
  },
  heroActionButtonSecondary: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)"
  },
  heroActionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    writingDirection: "rtl"
  },
  heroActionButtonTextPrimary: {
    color: shellColors.primaryStrong
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sectionHeaderTitle: {
    color: shellColors.text,
    fontSize: 18,
    fontWeight: "900",
    writingDirection: "rtl"
  },
  sectionHeaderAction: {
    color: shellColors.primary,
    fontSize: 13,
    fontWeight: "800",
    writingDirection: "rtl"
  },
  twoColumnGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 12
  },
  documentCard: {
    flexGrow: 1,
    flexBasis: "47%",
    minHeight: 138,
    borderRadius: 24,
    padding: 18,
    gap: 12
  },
  documentCardGreen: {
    backgroundColor: "#E7F3EB"
  },
  documentCardGold: {
    backgroundColor: "#FBF4E6"
  },
  monogramBadge: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  monogramGreen: {
    backgroundColor: shellColors.primarySoft
  },
  monogramGold: {
    backgroundColor: "#F2E5C9"
  },
  monogramText: {
    fontSize: 14,
    fontWeight: "900",
    writingDirection: "rtl"
  },
  documentTitle: {
    color: shellColors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl"
  },
  documentSubtitle: {
    color: shellColors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "right",
    writingDirection: "rtl"
  },
  featureRowCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 14,
    backgroundColor: shellColors.surface,
    borderWidth: 1,
    borderColor: shellColors.border,
    borderRadius: 24,
    padding: 18
  },
  featureRowContent: {
    flex: 1,
    alignItems: "flex-end",
    gap: 8
  },
  featureRowTitle: {
    color: shellColors.text,
    fontSize: 17,
    fontWeight: "900",
    writingDirection: "rtl"
  },
  featureRowDescription: {
    color: shellColors.textMuted,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "right",
    writingDirection: "rtl"
  },
  featureRowBadge: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  inlineActionButton: {
    alignSelf: "stretch",
    backgroundColor: shellColors.surfaceSoft,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center"
  },
  inlineActionButtonText: {
    fontSize: 13,
    fontWeight: "800",
    writingDirection: "rtl"
  },
  serviceTile: {
    flexGrow: 1,
    flexBasis: "47%",
    minHeight: 164,
    backgroundColor: shellColors.surface,
    borderWidth: 1,
    borderColor: shellColors.border,
    borderRadius: 24,
    padding: 16,
    alignItems: "flex-end",
    gap: 10
  },
  serviceTitle: {
    color: shellColors.text,
    fontSize: 16,
    fontWeight: "900",
    writingDirection: "rtl"
  },
  serviceSubtitle: {
    color: shellColors.textMuted,
    fontSize: 12,
    lineHeight: 20,
    textAlign: "right",
    writingDirection: "rtl"
  },
  serviceBadge: {
    marginTop: "auto",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999
  },
  serviceBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    writingDirection: "rtl"
  },
  alertSnapshotCard: {
    backgroundColor: shellColors.surface,
    borderWidth: 1,
    borderColor: shellColors.border,
    borderRadius: 24,
    padding: 18,
    gap: 8
  },
  alertSnapshotTitle: {
    color: shellColors.text,
    fontSize: 17,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl"
  },
  alertSnapshotMeta: {
    color: shellColors.textMuted,
    fontSize: 13,
    textAlign: "right",
    writingDirection: "rtl"
  },
  inlineLink: {
    marginTop: 6,
    alignSelf: "flex-end"
  },
  inlineLinkText: {
    color: shellColors.primary,
    fontSize: 13,
    fontWeight: "800",
    writingDirection: "rtl"
  },
  tabBar: {
    position: "absolute",
    right: 14,
    left: 14,
    bottom: 14,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: shellColors.borderStrong,
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: shellColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 18
  },
  tabButtonActive: {
    backgroundColor: shellColors.primarySoft
  },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: "#EFF3F1",
    alignItems: "center",
    justifyContent: "center"
  },
  tabIconActive: {
    backgroundColor: shellColors.primary
  },
  tabIconText: {
    color: shellColors.textMuted,
    fontSize: 10,
    fontWeight: "900"
  },
  tabIconTextActive: {
    color: "#FFFFFF"
  },
  tabLabel: {
    color: shellColors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    writingDirection: "rtl"
  },
  tabLabelActive: {
    color: shellColors.primary
  },
  pressed: {
    opacity: 0.88
  }
});
