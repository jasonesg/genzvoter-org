export const metadata = {
  title: "Dashboard | Houdys",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FBF4E8" }}>
      <main className="flex-1">{children}</main>
    </div>
  );
}
