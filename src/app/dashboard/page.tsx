"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth(); // Remove isAuthenticated
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Change from !isAuthenticated || !user to just !user
      router.push("/login");
      return;
    }

    // Route to appropriate dashboard based on user role
    switch (user.role) {
      case "admin":
        router.push("/admin");
        break;
      case "mentor":
        router.push("/mentor");
        break;
      case "teilnehmer":
        router.push("/student");
        break;
      default:
        router.push("/login");
    }
  }, [user, loading, router]); // Remove isAuthenticated from dependency array

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Dashboard wird geladen...</p>
      </div>
    </div>
  );
}
