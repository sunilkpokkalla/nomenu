"use client";

import { useTransition } from "react";
import { inviteStaff } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send } from "lucide-react";

export function InviteStaffForm({ restaurantId, plan }: { restaurantId: string; plan: string }) {
  const [isPending, startTransition] = useTransition();

  const isEliteOrHigher = plan === "elite" || plan === "enterprise";

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await inviteStaff(formData, restaurantId);
        });
      }}
      className="space-y-4"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="staff@example.com" 
              className="pl-9"
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Staff Role</Label>
          <select
            id="role"
            name="role"
            defaultValue="waitstaff"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-10 cursor-pointer"
            required
          >
            <option value="manager">Manager (Full Dashboard Access)</option>
            <option value="waitstaff">Front of House (Host, Cashier, Server)</option>
            <option value="kitchen" disabled={!isEliteOrHigher}>
              Kitchen (KDS Only) {!isEliteOrHigher && "🔒 Elite"}
            </option>
            <option value="kitchen_waitstaff" disabled={!isEliteOrHigher}>
              Full Staff (Kitchen & FOH) {!isEliteOrHigher && "🔒 Elite"}
            </option>
          </select>
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? (
          "Sending Invite..."
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Send Invitation
          </>
        )}
      </Button>
    </form>
  );
}
