"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { hasAdminPrivileges } from "@/lib/role-utils";
import MentorLayout from "@/components/MentorLayout";
import '../dashboard-globals.css'

export default function MentorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Force light mode for dashboard
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
  }, [])

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    // Only admins can access mentor routes (mentors are now admins in new system)
    if (!hasAdminPrivileges(user.role)) {
      router.push("/dashboard");
      return;
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Überprüfe Berechtigung...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated or not an admin
  if (!user || !hasAdminPrivileges(user.role)) {
    return null;
  }

  return <MentorLayout>{children}</MentorLayout>;
}
