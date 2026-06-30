import { IonIconLoader } from "@/components/icon";

export const metadata = {
  title: "Privacy Policy — SafeCheck SA",
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

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background)" }}>
      <IonIconLoader />

      {/* Nav back */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--color-border)" }}>
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
        <h1 style={h1}>Privacy Policy</h1>
        <p style={muted}>
          Last updated: June 2026 &nbsp;|&nbsp; SafeCheck SA is operated by Intermediate Data Systems (Pty) Ltd
        </p>
        <p style={p}>
          This Privacy Policy explains how SafeCheck SA collects, uses, and protects your personal information
          in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA) and the Electronic
          Communications and Transactions Act 25 of 2002 (ECTA).
        </p>

        {/* 1 */}
        <h2 style={h2}>1. Who We Are</h2>
        <p style={p}>
          SafeCheck SA is a service operated by <strong>Intermediate Data Systems (Pty) Ltd</strong>,
          Registration No. 2009/106070/23, with its registered address at 4th Floor, 96 Rivonia Road,
          TBE, Sandton, 2057. We operate as a responsible party under POPIA.
        </p>
        <p style={p}>
          Contact: <a href="mailto:info@safecheck.co.za" style={{ color: "var(--color-primary)" }}>info@safecheck.co.za</a>
          &nbsp;|&nbsp; Privacy queries: <a href="mailto:privacy@safecheck.co.za" style={{ color: "var(--color-primary)" }}>privacy@safecheck.co.za</a>
        </p>
        <p style={p}>
          SafeCheck SA is not affiliated with the South African Police Service (SAPS) or any government agency.
          Crime statistics used on this platform are derived from publicly available SAPS data.
        </p>

        {/* 2 */}
        <h2 style={h2}>2. Data We Collect</h2>
        <p style={p}>When you use SafeCheck SA we may collect:</p>
        <ul style={ul}>
          <li>Your full name and South African cell number (when you request a protection call)</li>
          <li>Vehicle details: make, model, year, and province</li>
          <li>Your preferred call time slot</li>
          <li>Consent timestamp and method</li>
          <li>Anonymous usage data: vehicle searches performed (no personal identifiers stored)</li>
        </ul>
        <p style={p}>We do not collect email addresses, ID numbers, financial information, or location data.</p>

        {/* 3 */}
        <h2 style={h2}>3. Why We Collect It</h2>
        <p style={p}>We collect your information solely to:</p>
        <ul style={ul}>
          <li>Connect you with FSCA-licensed vehicle insurance advisors at your requested call time</li>
          <li>Comply with POPIA record-keeping obligations for consent</li>
          <li>Improve the accuracy of our vehicle risk statistics</li>
        </ul>
        <p style={p}>
          We do not use your information for unsolicited marketing beyond the single call you request.
        </p>

        {/* 4 */}
        <h2 style={h2}>4. Who We Share Your Information With</h2>
        <p style={p}>
          Your lead record (name, phone, vehicle details, call time preference) is shared only with
          FSCA-licensed short-term insurance intermediaries who operate under their own POPIA obligations.
          We do not sell your data to data brokers or unrelated third parties.
        </p>
        <p style={p}>
          We may share anonymised, aggregated vehicle risk data with research partners. This data
          contains no personally identifiable information.
        </p>

        {/* 5 */}
        <h2 style={h2}>5. Data Retention</h2>
        <p style={p}>
          Your contact details (name, phone number) are retained for a maximum of <strong>30 days
          after lead handover</strong> to the insurance partner. After this period, your contact
          details are deleted from our systems. Vehicle search records (make, model, province, risk
          score) are retained in anonymised form for statistical purposes.
        </p>

        {/* 6 */}
        <h2 style={h2}>6. Your Rights Under POPIA</h2>
        <p style={p}>As a data subject under POPIA, you have the right to:</p>
        <ul style={ul}>
          <li><strong>Access</strong> — request a copy of the personal information we hold about you</li>
          <li><strong>Correction</strong> — request correction of inaccurate or incomplete information</li>
          <li><strong>Deletion</strong> — request deletion of your personal information</li>
          <li><strong>Objection</strong> — object to the processing of your information</li>
          <li><strong>Complaint</strong> — lodge a complaint with the Information Regulator</li>
        </ul>
        <p style={p}>
          To exercise any of these rights, email{" "}
          <a href="mailto:privacy@safecheck.co.za" style={{ color: "var(--color-primary)" }}>
            privacy@safecheck.co.za
          </a>.
          We will respond within 30 days.
        </p>

        {/* 7 */}
        <h2 style={h2}>7. Opt-Out</h2>
        <p style={p}>
          To opt out of being contacted, reply <strong>STOP</strong> to any SMS you receive, or email{" "}
          <a href="mailto:privacy@safecheck.co.za" style={{ color: "var(--color-primary)" }}>
            privacy@safecheck.co.za
          </a>{" "}
          with the subject line "OPT OUT". We will process your request within <strong>48 hours</strong>{" "}
          and notify the relevant insurance partner to remove your record.
        </p>

        {/* 8 */}
        <h2 style={h2}>8. Information Regulator</h2>
        <p style={p}>
          If you believe we have handled your personal information unlawfully, you may lodge a complaint
          with South Africa's Information Regulator:
        </p>
        <ul style={ul}>
          <li>Email: <a href="mailto:complaints@inforegulator.org.za" style={{ color: "var(--color-primary)" }}>complaints@inforegulator.org.za</a></li>
          <li>Website: <a href="https://www.inforegulator.org.za" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)" }}>www.inforegulator.org.za</a></li>
        </ul>

        {/* 9 */}
        <h2 style={h2}>9. Governing Law</h2>
        <p style={p}>
          This Privacy Policy is governed by the laws of the Republic of South Africa.
          Any disputes arising from this policy will be subject to the jurisdiction of the South African courts.
        </p>

        {/* 10 */}
        <h2 style={h2}>10. Changes to This Policy</h2>
        <p style={p}>
          We may update this Privacy Policy from time to time. The "Last updated" date at the top of
          this page will reflect any changes. Continued use of SafeCheck SA after changes are posted
          constitutes your acceptance of the revised policy.
        </p>

        <div style={{
          marginTop: 40,
          padding: "16px 20px",
          background: "#fff",
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
          <a href="/terms" style={{ color: "var(--color-primary)" }}>Terms of Service</a>
        </div>
      </div>
    </div>
  );
}
