"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { rejectPartnerAction } from "./actions";

export function RejectPartnerForm({ id, email, label = "Reject" }: { id: string; email: string; label?: string }) {
  return (
    <form action={async (formData) => {
      const reason = window.prompt("Reason for rejection/revocation (optional). This will be emailed to the partner:");
      if (reason !== null) {
        formData.append("reason", reason);
        await rejectPartnerAction(id, email, formData);
      }
    }}>
      <Button size="sm" variant="outline" className={`text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold h-8 rounded-lg border-rose-200 ${label === 'Revoke' ? 'w-auto' : 'w-28'}`} type="submit">
        {label === "Reject" && <X className="w-4 h-4 mr-1" />} {label}
      </Button>
    </form>
  );
}
