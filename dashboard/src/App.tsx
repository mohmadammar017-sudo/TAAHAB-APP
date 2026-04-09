import { useEffect, useMemo, useState } from "react";

type AlertSeverity = "low" | "medium" | "high";

interface AlertRecord {
  id: string;
  type: string;
  severity: AlertSeverity;
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  createdAt: string;
  status: string;
  hopCount: number;
  relayHistory: string[];
  currentDeviceId: string;
  receivedAt?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const typeLabels: Record<string, string> = {
  fire: "حريق",
  accident: "حادث",
  injury: "إصابة",
  suspicious: "جسم مشبوه",
  security: "خطر أمني"
};

const severityLabels: Record<AlertSeverity, string> = {
  low: "منخفض",
  medium: "متوسط",
  high: "عالٍ"
};

function formatDate(value?: string): string {
  if (!value) {
    return "غير متاح";
  }

  const date = new Date(value);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")} - ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

export default function App() {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchAlerts() {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/alerts`);

      if (!response.ok) {
        throw new Error("تعذر جلب البلاغات من الخادم");
      }

      const data = (await response.json()) as AlertRecord[];
      setAlerts(data);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchAlerts();
    const intervalId = window.setInterval(() => {
      void fetchAlerts();
    }, 10000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const stats = useMemo(() => {
    const highSeverityCount = alerts.filter((alert) => alert.severity === "high").length;
    const totalHops = alerts.reduce((sum, alert) => sum + alert.hopCount, 0);

    return {
      total: alerts.length,
      highSeverityCount,
      averageHops: alerts.length > 0 ? (totalHops / alerts.length).toFixed(1) : "0.0"
    };
  }, [alerts]);

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Operations Dashboard</p>
          <h1>غرفة عمليات تأهّب</h1>
          <p className="hero-copy">
            شاشة متابعة البلاغات التي وصلت من شبكة الترحيل المحلية بعد انقطاع الإنترنت.
          </p>
        </div>
        <button className="refresh-button" onClick={() => void fetchAlerts()}>
          تحديث الآن
        </button>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>إجمالي البلاغات</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="stat-card">
          <span>بلاغات عالية الخطورة</span>
          <strong>{stats.highSeverityCount}</strong>
        </article>
        <article className="stat-card">
          <span>متوسط مرات التمرير</span>
          <strong>{stats.averageHops}</strong>
        </article>
      </section>

      <section className="table-card">
        <div className="table-header">
          <div>
            <h2>البلاغات المستلمة</h2>
            <p>المصدر: {API_BASE_URL}/api/alerts</p>
          </div>
          <span className="status-pill">{loading ? "جارٍ التحديث" : "مباشر"}</span>
        </div>

        {error ? <div className="feedback error">{error}</div> : null}
        {!loading && alerts.length === 0 ? (
          <div className="feedback">لا توجد بلاغات مستلمة بعد.</div>
        ) : null}

        <div className="alerts-grid">
          {alerts.map((alert) => (
            <article className="alert-card" key={alert.id}>
              <div className="alert-card__top">
                <div>
                  <p className="alert-id">{alert.id}</p>
                  <h3>{typeLabels[alert.type] ?? alert.type}</h3>
                </div>
                <span className={`severity-pill severity-pill--${alert.severity}`}>
                  {severityLabels[alert.severity]}
                </span>
              </div>

              <p className="alert-description">{alert.description}</p>

              <dl className="alert-meta">
                <div>
                  <dt>الوقت</dt>
                  <dd>{formatDate(alert.createdAt)}</dd>
                </div>
                <div>
                  <dt>الموقع</dt>
                  <dd>{alert.location.address ?? `${alert.location.lat}, ${alert.location.lng}`}</dd>
                </div>
                <div>
                  <dt>عدد مرات التمرير</dt>
                  <dd>{alert.hopCount}</dd>
                </div>
                <div>
                  <dt>حالة الوصول</dt>
                  <dd>{alert.status}</dd>
                </div>
                <div>
                  <dt>آخر جهاز حامل</dt>
                  <dd>{alert.currentDeviceId}</dd>
                </div>
                <div>
                  <dt>وقت الاستلام</dt>
                  <dd>{formatDate(alert.receivedAt)}</dd>
                </div>
              </dl>

              <div className="relay-history">
                <span>المسار</span>
                <strong>{alert.relayHistory.join(" ← ")}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

