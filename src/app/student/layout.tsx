"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import StudentLayout from "@/components/StudentLayout";

export default function StudentRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth(); // removed isAuthenticated
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "teilnehmer") {
      router.push("/dashboard");
      return;
    }
  }, [user, loading, router]); // removed isAuthenticated from deps

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-muted-foreground">
            Student Portal wird geladen...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "teilnehmer") {
    return null; // Will redirect
  }

  return <StudentLayout>{children}</StudentLayout>;
}
