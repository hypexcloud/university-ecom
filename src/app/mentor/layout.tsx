"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { hasAdminPrivileges } from "@/lib/role-utils";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Überprüfe Berechtigung...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated or not an admin
  if (!user || !hasAdminPrivileges(user.role)) {
    return null;
  }

  return <>{children}</>;
}
