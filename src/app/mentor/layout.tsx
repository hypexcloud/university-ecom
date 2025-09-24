"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth(); // Remove isAuthenticated
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    // Check if user has mentor role
    if (user.role !== "mentor") {
      router.push("/dashboard");
      return;
    }
  }, [user, loading, router]); // Remove isAuthenticated from dependency array

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

  // Don't render if user is not authenticated or not a mentor
  if (!user || user.role !== "mentor") {
    return null;
  }

  return <>{children}</>;
}
