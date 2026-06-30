export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d" }}>
      {children}
    </div>
  );
}
