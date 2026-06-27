"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowRight } from "lucide-react";
import { acceptInvite } from "./actions";

export function JoinTeamForm({ token, email }: { token: string, email: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await acceptInvite(formData, token, email);
        });
      }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Create Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              id="password" 
              name="password" 
              type="password" 
              className="pl-9"
              placeholder="••••••••"
              required 
              minLength={6}
            />
          </div>
          <p className="text-[10px] text-slate-500">Must be at least 6 characters long.</p>
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full h-11 text-base shadow-sm">
        {isPending ? (
          "Setting up account..."
        ) : (
          <>
            Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
