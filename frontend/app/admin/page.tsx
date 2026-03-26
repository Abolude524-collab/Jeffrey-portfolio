import AdminDashboard from "../../components/AdminDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | Portfolio CMS",
    description: "Manage projects, media, and contact messages",
};

export default function AdminPage() {
    return <AdminDashboard />;
}
