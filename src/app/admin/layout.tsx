import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | GAMINGGLOW Admin",
  },
  description: "Admin dashboard for GAMINGGLOW",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy-900">
      {children}
    </div>
  );
}
