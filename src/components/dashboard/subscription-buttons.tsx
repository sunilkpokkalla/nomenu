"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SubscriptionButton({ 
  planId, 
  planName, 
  isEnterprise 
}: { 
  planId: string; 
  planName: string; 
  isEnterprise: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stripe/subscription-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to initiate checkout");
      }
    } catch (error: any) {
      console.error(error);
      alert(`Checkout failed: ${error.message || "Unknown error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full font-semibold"
      size={isEnterprise ? "lg" : "default"}
      variant={isEnterprise ? "default" : planId === "elite" ? "outline" : "secondary"}
    >
      {loading ? "Redirecting..." : `Upgrade to ${planName}`}
    </Button>
  );
}

export function PortalButton() {
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stripe/create-portal", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to open portal");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to open billing portal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handlePortal} disabled={loading}>
      {loading ? "Loading..." : "Manage Subscription"}
    </Button>
  );
}
