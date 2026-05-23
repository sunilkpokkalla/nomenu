import Link from "next/link";
import { QrCode } from "lucide-react";

import { signup } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <QrCode className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold">NoMenu</span>
          </Link>
          <div>
            <CardTitle>Create your free menu</CardTitle>
            <CardDescription>
              Start with email, password, and your restaurant name.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {searchParams.message ? (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {searchParams.message}
            </div>
          ) : null}
          <form action={signup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Restaurant name</Label>
              <Input id="restaurantName" name="restaurantName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or test instantly</span>
            </div>
          </div>

          <form action={signup}>
            <input type="hidden" name="restaurantName" value="Demo Restaurant" />
            <input type="hidden" name="email" value="demo@nomenu.com" />
            <input type="hidden" name="password" value="demo123456" />
            <Button type="submit" variant="secondary" className="w-full">
              Create Demo Account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
