import { AnimatedCounter } from "@/components/animated-counter";
import { Ticker } from "@/components/ticker";
import { HeroSection } from "@/components/hero-section";
import { CheckCtaButton } from "@/components/check-cta-button";
import { Icon, IonIconLoader } from "@/components/icon";
import { LiveFeed } from "@/components/live-feed";
import { StolenTodayCounter, ChecksTodayCounter } from "@/components/live-stats";
import { ProvinceBars } from "@/components/province-bars";
import {
  getStats,
  getTopStolen,
  getProvinces,
  getStories,
  HOW_IT_WORKS,
} from "./lib/data";

const card: React.CSSProperties = {
  background: "var(--color-surface)",
  borderRadius: 8,
  border: "1px solid var(--color-border)",
};

const sectionPad: React.CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "0 20px",
};



export default async function Home() {
  const [stats, topStolen, provinces, stories] = await Promise.all([
    getStats(),
    getTopStolen(),
    getProvinces(),
    getStories(),
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <IonIconLoader />

      {/* Disclaimer Banner */}
      <div
        style={{
          background: "#1e3a5f",
          color: "#fff",
          fontSize: 11,
          textAlign: "center",
          padding: "8px 20px",
          lineHeight: 1.6,
          letterSpacing: "0.01em",
        }}
      >
        This site aggregates publicly available SAPS crime statistics. Scenarios
        shown are representative examples. Not affiliated with SAPS or any
        government agency.
      </div>

      {/* Ticker */}
      <Ticker />

      {/* Hero / Form toggle */}
      <HeroSection />

      {/* Live Stats */}
      <section style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ ...sectionPad, padding: "48px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {/* Stolen Today — live incrementing */}
            <div style={{ ...card, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Icon name="alert-circle-outline" size={16} color="var(--color-text-muted)" />
                <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 500 }}>Stolen Today</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--color-text)" }}>
                <StolenTodayCounter initial={stats.stolen_today} />
              </div>
            </div>

            {/* Checks Today — time-seeded */}
            <div style={{ ...card, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Icon name="shield-checkmark-outline" size={16} color="var(--color-text-muted)" />
                <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 500 }}>Checks Today</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--color-text)" }}>
                <ChecksTodayCounter />
              </div>
            </div>

            {/* Static counters */}
            {[
              { label: "Annual Thefts", value: stats.annual_thefts, suffix: "", icon: "car-outline" },
              { label: "Recovery Rate", value: Number(stats.recovery_rate_pct), suffix: "%", icon: "locate-outline" },
              { label: "Avg. Time to Border", value: stats.time_to_border_min, suffix: " min", icon: "time-outline" },
            ].map((stat) => (
              <div key={stat.label} style={{ ...card, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Icon name={stat.icon} size={16} color="var(--color-text-muted)" />
                  <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 500 }}>
                    {stat.label}
                  </span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "var(--color-text)" }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section style={{ background: "var(--color-background)", flex: 1 }}>
        <div style={{ ...sectionPad, padding: "48px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>

            {/* Stories + Sidebar row on desktop */}
            <div className="content-grid">

              {/* Live Feed */}
              <LiveFeed initialStories={stories} />

              {/* Sidebar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Top 5 */}
                <div style={{ ...card, padding: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)", margin: "0 0 16px" }}>
                    Top 5 Most Stolen Vehicles
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {topStolen.map((v) => (
                      <div key={v.rank} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            background: "var(--color-surface-raised)",
                            color: "var(--color-text-muted)",
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {v.rank}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>
                            {v.name}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                            {v.volume.toLocaleString()} thefts/yr
                          </div>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-primary)" }}>
                          {v.trend}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Province Risk */}
                <div style={{ ...card, padding: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)", margin: "0 0 16px" }}>
                    Province Risk Levels
                  </h3>
                  <ProvinceBars provinces={provinces} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
        <div style={{ ...sectionPad, padding: "64px 20px", textAlign: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)", margin: "0 0 40px" }}>
            How SafeCheck Works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    margin: "0 auto 10px",
                    borderRadius: "50%",
                    background: "#DC2626",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)", margin: "0 0 6px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.6, margin: 0 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40 }}>
            <CheckCtaButton />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#111827", color: "#f9fafb" }}>
        <div style={{ ...sectionPad, padding: "40px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>SafeCheck SA</div>
              <p style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.7, margin: "0 0 4px" }}>
                Powered by Nerve
              </p>
              <p style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.7, margin: "0 0 4px" }}>
                Intermediate Data Systems (Pty) Ltd<br />
                Reg No. 2009/106070/23
              </p>
              <p style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.7, margin: 0 }}>
                4th Floor, 96 Rivonia Road, TBE, Sandton, 2057
              </p>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Contact</div>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>
                info@safecheck.co.za
              </p>
              <p style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
                Not affiliated with SAPS or any government agency.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Legal</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <a href="/privacy" style={{ fontSize: 12, color: "#9ca3af", textDecoration: "none" }}>
                  Privacy Policy
                </a>
                <a href="/terms" style={{ fontSize: 12, color: "#9ca3af", textDecoration: "none" }}>
                  Terms of Service
                </a>
                <p style={{ fontSize: 11, color: "#6b7280", margin: "6px 0 0", lineHeight: 1.6 }}>
                  POPIA Compliant &bull; We process personal information lawfully and with your consent.
                </p>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              fontSize: 11,
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            &copy; {new Date().getFullYear()} SafeCheck SA. All rights reserved. &nbsp;&bull;&nbsp;
            Not affiliated with SAPS or any government agency.
          </div>
        </div>
      </footer>
    </div>
  );
}
