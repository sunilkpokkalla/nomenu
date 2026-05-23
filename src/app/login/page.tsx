import Link from "next/link";
import { QrCode } from "lucide-react";

import { login } from "@/app/auth/actions";
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

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string; next?: string };
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
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to manage menus, QR codes, and restaurant settings.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {searchParams.message ? (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {searchParams.message}
            </div>
          ) : null}
          <form action={login} className="space-y-4">
            <input type="hidden" name="next" value={searchParams.next ?? "/dashboard"} />
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
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Log in
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

          <form action={login}>
            <input type="hidden" name="next" value={searchParams.next ?? "/dashboard"} />
            <input type="hidden" name="email" value="demo@nomenu.com" />
            <input type="hidden" name="password" value="demo123" />
            <Button type="submit" variant="secondary" className="w-full">
              Log in with Demo Account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to NoMenu?{" "}
            <Link href="/signup" className="font-semibold text-primary">
              Create your free menu
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
