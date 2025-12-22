"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    // Route to appropriate dashboard based on user role (NEW ROLE SYSTEM)
    switch (user.role) {
      case "admin":
        router.push("/admin");
        break;
      case "kunde":
        // Kunde (customers) go to student dashboard for now
        router.push("/student");
        break;
      case "affiliate":
        // Affiliates will have their own dashboard in Phase 3
        router.push("/affiliate");
        break;
      case "besucher":
        // Visitors shouldn't reach here, redirect to home
        router.push("/");
        break;
      default:
        router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Dashboard wird geladen...</p>
      </div>
    </div>
  );
}
