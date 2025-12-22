"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import StudentLayout from "@/components/StudentLayout";
import { hasCustomerAccess } from "@/lib/role-utils";
import '../dashboard-globals.css'

export default function StudentRootLayout({
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

    // Allow kunde and admin to access student dashboard
    if (!hasCustomerAccess(user.role)) {
      router.push("/dashboard");
      return;
    }
  }, [user, loading, router]);

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

  if (!user || !hasCustomerAccess(user.role)) {
    return null; // Will redirect
  }

  return <StudentLayout>{children}</StudentLayout>;
}
