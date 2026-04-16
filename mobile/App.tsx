import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import AbsherShellScreen, { type AbsherTabKey } from "./src/screens/AbsherShellScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CreateAlertScreen from "./src/screens/CreateAlertScreen";
import RelayStatusScreen from "./src/screens/RelayStatusScreen";
import AlertsInboxScreen from "./src/screens/AlertsInboxScreen";
import { createAlert, appendLog, DEFAULT_DEVICE_ID } from "./src/services/alertService";
import {
  createDemoDevices,
  flagDeviceInternet,
  getDeviceById,
  relayAlert,
  scanNearbyDevices,
  syncDeviceAvailability
} from "./src/services/meshService";
import { getCurrentNetworkStatus, resolveEffectiveNetworkStatus } from "./src/services/networkService";
import { getAllAlerts, saveAlert } from "./src/services/storageService";
import { getApiBaseUrl, syncPendingAlerts } from "./src/services/syncService";
import { subscribeToShake } from "./src/services/shakeService";
import { colors } from "./src/theme";
import type { AlertPacket, CreateAlertInput } from "./src/types/alert";
import type { MeshDevice } from "./src/types/device";

type ScreenName = "absher" | "home" | "create" | "relay" | "inbox";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("absher");
  const [activeAbsherTab, setActiveAbsherTab] = useState<AbsherTabKey>("home");
  const [alerts, setAlerts] = useState<AlertPacket[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [realNetworkConnected, setRealNetworkConnected] = useState(false);
  const [networkOverride, setNetworkOverride] = useState<boolean | null>(null);
  const [searching, setSearching] = useState(false);
  const [creatingAlert, setCreatingAlert] = useState(false);
  const [nearbyDevice, setNearbyDevice] = useState<MeshDevice | null>(null);
  const [devices, setDevices] = useState<MeshDevice[]>(createDemoDevices());
  const [shakeNoticeVisible, setShakeNoticeVisible] = useState(false);
  const currentScreenRef = useRef<ScreenName>("absher");

  const effectiveIsConnected = useMemo(
    () => resolveEffectiveNetworkStatus(realNetworkConnected, networkOverride),
    [realNetworkConnected, networkOverride]
  );

  const networkModeLabel = networkOverride === null ? "فعلي" : "محاكاة";
  const isShellScreen = currentScreen === "absher";

  const selectedAlert = useMemo(
    () => alerts.find((alert) => alert.id === selectedAlertId) ?? null,
    [alerts, selectedAlertId]
  );

  const latestAlert = useMemo(() => alerts[0] ?? null, [alerts]);

  const pendingAlertsCount = useMemo(
    () => alerts.filter((alert) => alert.status !== "synced").length,
    [alerts]
  );

  const refreshAlerts = useCallback(async () => {
    const storedAlerts = await getAllAlerts();
    setAlerts(storedAlerts);

    if (storedAlerts.length === 0) {
      setSelectedAlertId(null);
      return;
    }

    setSelectedAlertId((current) =>
      current && storedAlerts.some((alert) => alert.id === current) ? current : storedAlerts[0].id
    );
  }, []);

  const refreshNetwork = useCallback(async () => {
    const currentStatus = await getCurrentNetworkStatus();
    setRealNetworkConnected(currentStatus);
  }, []);

  const persistAlert = useCallback(
    async (alert: AlertPacket) => {
      await saveAlert(alert);
      setSelectedAlertId(alert.id);
      await refreshAlerts();
      return alert;
    },
    [refreshAlerts]
  );

  useEffect(() => {
    const initialize = async () => {
      await refreshNetwork();
      await refreshAlerts();
      setDevices(createDemoDevices());
    };

    void initialize();
  }, [refreshAlerts, refreshNetwork]);

  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  useEffect(() => {
    if (!selectedAlert) {
      setNearbyDevice(null);
      return;
    }

    setDevices((currentDevices) =>
      syncDeviceAvailability(currentDevices, selectedAlert.currentDeviceId)
    );
  }, [selectedAlert]);

  useEffect(() => {
    const unsubscribe = subscribeToShake(() => {
      if (currentScreenRef.current !== "absher") {
        return;
      }

      setActiveAbsherTab("home");
      setCurrentScreen("home");
      setShakeNoticeVisible(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!shakeNoticeVisible) {
      return;
    }

    const timeout = setTimeout(() => {
      setShakeNoticeVisible(false);
    }, 2200);

    return () => clearTimeout(timeout);
  }, [shakeNoticeVisible]);

  const handleCreateAlert = useCallback(
    async (input: CreateAlertInput) => {
      setCreatingAlert(true);

      try {
        const alert = await createAlert(input, DEFAULT_DEVICE_ID);
        await refreshAlerts();
        setSelectedAlertId(alert.id);
        setNearbyDevice(null);
        setDevices(createDemoDevices());
        setCurrentScreen("relay");
      } finally {
        setCreatingAlert(false);
      }
    },
    [refreshAlerts]
  );

  const openRelayForAlert = useCallback((alertId: string) => {
    setSelectedAlertId(alertId);
    setCurrentScreen("relay");
  }, []);

  const handleStartSearch = useCallback(async () => {
    if (!selectedAlert) {
      return;
    }

    setSearching(true);
    setNearbyDevice(null);

    const updatedAlert = appendLog(selectedAlert, "جارٍ البحث عن جهاز قريب", "info");
    await persistAlert(updatedAlert);
    setDevices((currentDevices) =>
      syncDeviceAvailability(currentDevices, selectedAlert.currentDeviceId)
    );
    setSearching(false);
  }, [persistAlert, selectedAlert]);

  const handleSimulateFoundDevice = useCallback(async () => {
    if (!selectedAlert) {
      return;
    }

    setSearching(true);

    try {
      const foundDevices = await scanNearbyDevices(selectedAlert.currentDeviceId, devices);
      const nextDevice = foundDevices[0] ?? null;

      if (!nextDevice) {
        const updatedAlert = appendLog(
          selectedAlert,
          "لم يتم العثور على جهاز Relay متاح حاليًا",
          "warning"
        );
        await persistAlert(updatedAlert);
        setNearbyDevice(null);
        return;
      }

      const updatedAlert = appendLog(
        {
          ...selectedAlert,
          nearbyDeviceId: nextDevice.id
        },
        `تم العثور على جهاز ${nextDevice.name}`,
        "success"
      );

      await persistAlert(updatedAlert);
      setNearbyDevice(nextDevice);
      setDevices((currentDevices) =>
        syncDeviceAvailability(currentDevices, selectedAlert.currentDeviceId, nextDevice.id)
      );
    } finally {
      setSearching(false);
    }
  }, [devices, persistAlert, selectedAlert]);

  const handleRelayAlert = useCallback(async () => {
    if (!selectedAlert) {
      return;
    }

    const targetDeviceId = nearbyDevice?.id ?? selectedAlert.nearbyDeviceId;

    if (!targetDeviceId) {
      const updatedAlert = appendLog(
        selectedAlert,
        "يجب العثور على جهاز قريب قبل التمرير",
        "warning"
      );
      await persistAlert(updatedAlert);
      return;
    }

    const relayedAlert = await relayAlert(selectedAlert, targetDeviceId, devices);
    await persistAlert(relayedAlert);
    setNearbyDevice(null);
    setDevices((currentDevices) =>
      syncDeviceAvailability(currentDevices, relayedAlert.currentDeviceId)
    );
  }, [devices, nearbyDevice, persistAlert, selectedAlert]);

  const handleSimulateInternet = useCallback(async () => {
    if (!selectedAlert) {
      return;
    }

    setNetworkOverride(true);
    setDevices((currentDevices) =>
      flagDeviceInternet(currentDevices, selectedAlert.currentDeviceId, true)
    );

    const updatedAlert = appendLog(
      selectedAlert,
      "تم اكتشاف اتصال بالإنترنت على الجهاز الحالي",
      "success"
    );

    await persistAlert(updatedAlert);
  }, [persistAlert, selectedAlert]);

  const handleUploadAlerts = useCallback(async () => {
    if (!selectedAlert) {
      return;
    }

    const currentCarrierDevice = getDeviceById(devices, selectedAlert.currentDeviceId);
    const canUpload = effectiveIsConnected || Boolean(currentCarrierDevice?.hasInternet);

    if (!canUpload) {
      const updatedAlert = appendLog(
        selectedAlert,
        "تعذر رفع البلاغ لعدم توفر اتصال بالإنترنت",
        "warning"
      );
      await persistAlert(updatedAlert);
      return;
    }

    try {
      await syncPendingAlerts(true);
      await refreshAlerts();
    } catch (error) {
      const updatedAlert = appendLog(
        selectedAlert,
        error instanceof Error ? error.message : "فشل رفع البلاغ إلى الخادم",
        "warning"
      );
      await persistAlert(updatedAlert);
    }
  }, [devices, effectiveIsConnected, persistAlert, refreshAlerts, selectedAlert]);

  const handleToggleConnectivity = useCallback(async () => {
    const nextValue = !(networkOverride ?? realNetworkConnected);
    setNetworkOverride(nextValue);
    setDevices((currentDevices) =>
      flagDeviceInternet(currentDevices, selectedAlert?.currentDeviceId ?? DEFAULT_DEVICE_ID, nextValue)
    );
    await refreshNetwork();
  }, [networkOverride, realNetworkConnected, refreshNetwork, selectedAlert]);

  const commonScreenProps = {
    onBackHome: () => setCurrentScreen("home"),
    onOpenInbox: () => setCurrentScreen("inbox")
  };

  return (
    <SafeAreaView style={[styles.safeArea, isShellScreen && styles.safeAreaShell]}>
      <ExpoStatusBar style={isShellScreen ? "dark" : "light"} />
      <StatusBar
        barStyle={isShellScreen ? "dark-content" : "light-content"}
        backgroundColor={isShellScreen ? "#F3F6F4" : colors.background}
      />

      {!isShellScreen ? <View style={styles.backgroundGlowTop} /> : null}
      {!isShellScreen ? <View style={styles.backgroundGlowBottom} /> : null}

      {shakeNoticeVisible ? (
        <View style={styles.shakeBanner}>
          <Text style={styles.shakeBannerText}>تم فتح تأهّب عبر هزّ الجهاز</Text>
        </View>
      ) : null}

      {currentScreen === "absher" ? (
        <AbsherShellScreen
          activeTab={activeAbsherTab}
          isConnected={effectiveIsConnected}
          pendingAlertsCount={pendingAlertsCount}
          latestAlert={latestAlert}
          onChangeTab={setActiveAbsherTab}
          onOpenTaahab={() => setCurrentScreen("home")}
          onCreateAlert={() => setCurrentScreen("create")}
          onOpenInbox={() => setCurrentScreen("inbox")}
          onOpenLatestAlert={() => {
            if (latestAlert) {
              openRelayForAlert(latestAlert.id);
              return;
            }

            setCurrentScreen("home");
          }}
          onToggleConnectivity={handleToggleConnectivity}
        />
      ) : null}

      {currentScreen === "home" ? (
        <HomeScreen
          isConnected={effectiveIsConnected}
          networkModeLabel={networkModeLabel}
          pendingAlertsCount={pendingAlertsCount}
          onBackToApp={() => setCurrentScreen("absher")}
          onCreateAlert={() => setCurrentScreen("create")}
          onOpenInbox={() => setCurrentScreen("inbox")}
          onToggleConnectivity={handleToggleConnectivity}
        />
      ) : null}

      {currentScreen === "create" ? (
        <CreateAlertScreen
          isSubmitting={creatingAlert}
          onBack={() => setCurrentScreen("home")}
          onSubmit={handleCreateAlert}
        />
      ) : null}

      {currentScreen === "relay" ? (
        <RelayStatusScreen
          {...commonScreenProps}
          alert={selectedAlert}
          devices={devices}
          nearbyDevice={nearbyDevice}
          isConnected={effectiveIsConnected}
          searching={searching}
          apiBaseUrl={getApiBaseUrl()}
          onStartSearch={handleStartSearch}
          onSimulateFoundDevice={handleSimulateFoundDevice}
          onRelayAlert={handleRelayAlert}
          onSimulateInternet={handleSimulateInternet}
          onUploadAlerts={handleUploadAlerts}
        />
      ) : null}

      {currentScreen === "inbox" ? (
        <AlertsInboxScreen
          alerts={alerts}
          selectedAlertId={selectedAlertId}
          onBack={() => setCurrentScreen("home")}
          onCreateAlert={() => setCurrentScreen("create")}
          onOpenRelay={(alertId) => {
            setSelectedAlertId(alertId);
            setCurrentScreen("relay");
          }}
          onSelectAlert={setSelectedAlertId}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  safeAreaShell: {
    backgroundColor: "#F3F6F4"
  },
  backgroundGlowTop: {
    position: "absolute",
    top: -160,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: "rgba(0, 224, 138, 0.10)"
  },
  backgroundGlowBottom: {
    position: "absolute",
    bottom: -180,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: "rgba(121, 207, 255, 0.08)"
  },
  shakeBanner: {
    position: "absolute",
    top: 18,
    left: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: "rgba(7, 23, 18, 0.94)",
    borderWidth: 1,
    borderColor: "rgba(0, 224, 138, 0.34)",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  shakeBannerText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
    writingDirection: "rtl"
  }
});
