import { IonIconLoader } from "@/components/icon";

export const metadata = {
  title: "Terms of Service — SafeCheck SA",
};

const wrap: React.CSSProperties = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "48px 20px 80px",
};

const h1: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: "var(--color-text)",
  margin: "0 0 6px",
};

const h2: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: "var(--color-text)",
  margin: "36px 0 10px",
  paddingTop: 4,
  borderTop: "1px solid var(--color-border)",
};

const p: React.CSSProperties = {
  fontSize: 14,
  color: "var(--color-text)",
  lineHeight: 1.75,
  margin: "0 0 12px",
};

const muted: React.CSSProperties = {
  fontSize: 12,
  color: "var(--color-text-muted)",
  lineHeight: 1.6,
  margin: "0 0 8px",
};

const ul: React.CSSProperties = {
  fontSize: 14,
  color: "var(--color-text)",
  lineHeight: 1.75,
  margin: "0 0 12px",
  paddingLeft: 20,
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background)" }}>
      <IonIconLoader />

      {/* Nav back */}
      <div style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "14px 20px" }}>
          <a
            href="/"
            style={{
              fontSize: 13, color: "var(--color-primary)",
              textDecoration: "none", fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}
          >
            ← Back to SafeCheck SA
          </a>
        </div>
      </div>

      <div style={wrap}>
        <h1 style={h1}>Terms of Service</h1>
        <p style={muted}>
          Last updated: June 2026 &nbsp;|&nbsp; SafeCheck SA is operated by Intermediate Data Systems (Pty) Ltd
        </p>
        <p style={p}>
          By using SafeCheck SA you agree to these Terms of Service. Please read them carefully.
        </p>

        <h2 style={h2}>1. About SafeCheck SA</h2>
        <p style={p}>
          SafeCheck SA is a vehicle risk information service operated by{" "}
          <strong>Intermediate Data Systems (Pty) Ltd</strong>, Registration No. 2009/106070/23,
          4th Floor, 96 Rivonia Road, TBE, Sandton, 2057.
        </p>
        <p style={p}>
          SafeCheck SA is <strong>not affiliated with the South African Police Service (SAPS) or any
          government agency</strong>. Crime statistics displayed on this platform are derived from
          publicly available SAPS annual crime report data and are provided for informational purposes only.
        </p>

        <h2 style={h2}>2. Nature of the Service</h2>
        <p style={p}>SafeCheck SA provides:</p>
        <ul style={ul}>
          <li>Vehicle theft risk assessments based on publicly available crime statistics</li>
          <li>A lead referral service connecting users with FSCA-licensed insurance intermediaries</li>
        </ul>
        <p style={p}>
          SafeCheck SA does not provide insurance advice, quotes, or policies. We are a lead generation
          and information platform only. Any insurance product you take out will be with a licensed
          insurer, not with Intermediate Data Systems (Pty) Ltd.
        </p>

        <h2 style={h2}>3. Accuracy of Information</h2>
        <p style={p}>
          Risk scores and theft statistics are based on aggregated SAPS data and are updated periodically.
          They represent statistical averages and are not a guarantee of future events. Your individual
          risk may differ based on factors not captured in our dataset.
        </p>
        <p style={p}>
          Stories and scenarios displayed on this platform are representative examples based on actual
          claim rejection patterns reported to SAIA. Names are withheld for privacy. They are not
          verbatim accounts of specific incidents.
        </p>

        <h2 style={h2}>4. Consent and Lead Referral</h2>
        <p style={p}>
          By submitting the protection form and ticking the consent checkbox, you expressly authorise
          SafeCheck SA to share your name, phone number, vehicle details, and preferred call time with
          FSCA-licensed short-term insurance intermediaries for the purpose of a single introductory call.
        </p>
        <p style={p}>
          This consent is recorded with a timestamp and method ("web_checkbox") in accordance with POPIA.
          You may withdraw consent at any time by emailing{" "}
          <a href="mailto:privacy@safecheck.co.za" style={{ color: "var(--color-primary)" }}>
            privacy@safecheck.co.za
          </a>.
        </p>

        <h2 style={h2}>5. Prohibited Use</h2>
        <p style={p}>You may not use SafeCheck SA to:</p>
        <ul style={ul}>
          <li>Submit false or misleading personal information</li>
          <li>Scrape, copy, or republish risk score data for commercial purposes</li>
          <li>Interfere with or disrupt the platform or its infrastructure</li>
          <li>Impersonate another person when submitting a lead</li>
        </ul>

        <h2 style={h2}>6. Limitation of Liability</h2>
        <p style={p}>
          Intermediate Data Systems (Pty) Ltd provides this platform "as is" without warranty of any
          kind. To the fullest extent permitted by South African law, we are not liable for any loss
          or damage arising from reliance on risk assessments, failure to obtain insurance cover, or
          any action taken or not taken based on information displayed on this platform.
        </p>

        <h2 style={h2}>7. SAPS Non-Affiliation</h2>
        <p style={p}>
          SafeCheck SA is an independent commercial service. It is not affiliated with, endorsed by,
          or operated by the South African Police Service (SAPS) or any government body. The SAPS
          name and statistics are referenced solely to acknowledge the public data source.
        </p>

        <h2 style={h2}>8. Intellectual Property</h2>
        <p style={p}>
          All content, design, and software on SafeCheck SA is the property of Intermediate Data
          Systems (Pty) Ltd. Reproduction or redistribution without written permission is prohibited.
        </p>

        <h2 style={h2}>9. Governing Law</h2>
        <p style={p}>
          These Terms are governed by the laws of the Republic of South Africa. Any disputes will be
          subject to the exclusive jurisdiction of the South Gauteng High Court, Johannesburg.
        </p>

        <h2 style={h2}>10. Changes to These Terms</h2>
        <p style={p}>
          We may update these Terms from time to time. The "Last updated" date reflects any changes.
          Continued use of the platform after changes constitutes acceptance.
        </p>

        <div style={{
          marginTop: 40,
          padding: "16px 20px",
          background: "var(--color-surface)",
          borderRadius: 10,
          border: "1px solid var(--color-border)",
          fontSize: 12,
          color: "var(--color-text-muted)",
          lineHeight: 1.7,
        }}>
          <strong style={{ color: "var(--color-text)" }}>Intermediate Data Systems (Pty) Ltd</strong><br />
          Reg No. 2009/106070/23 &nbsp;|&nbsp; 4th Floor, 96 Rivonia Road, TBE, Sandton, 2057<br />
          <a href="mailto:info@safecheck.co.za" style={{ color: "var(--color-primary)" }}>info@safecheck.co.za</a>
          &nbsp;|&nbsp;
          <a href="/privacy" style={{ color: "var(--color-primary)" }}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
