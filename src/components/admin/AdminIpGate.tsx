"use client";

import { useEffect, useState, PropsWithChildren } from "react";
import Spinner from "@/components/ui/Spinner";

export default function AdminIpGate({
  allowedIps = "",
  children,
}: PropsWithChildren<{ allowedIps?: string }>) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [clientIp, setClientIp] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkIp() {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        const ip = (data.ip as string).trim();
        
        if (!mounted) return;
        setClientIp(ip);

        // Parse allowed IP list from environment prop
        const allowedList = allowedIps
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        // Check exact match OR dynamic IP subnet prefix match
        const isMatch = allowedList.some((allowedIp) => ip.startsWith(allowedIp));
        setAllowed(isMatch);
      } catch (e) {
        setAllowed(false);
      } finally {
        if (mounted) setChecking(false);
      }
    }

    checkIp();

    return () => {
      mounted = false;
    };
  }, [allowedIps]);

  if (checking) {
    return (
      <div className="p-8 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
        <p className="text-sm text-foreground-muted mb-4">
          Your IP ({clientIp || "unknown"}) is not permitted to access the admin area.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}