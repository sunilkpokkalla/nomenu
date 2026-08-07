import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Verify Cron Secret
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // 2. Initialize Admin Client
    const supabaseAdmin = createAdminClient();

    // Calculate cutoff date (7 days ago)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const deletedUsers: string[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      // Fetch users from Supabase Auth (admin API)
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: 1000
      });

      if (error) {
        throw error;
      }

      if (!users || users.length === 0) {
        hasMore = false;
        break;
      }

      // Filter for users: unverified (email_confirmed_at is null) and created_at older than 7 days ago
      const usersToClean = users.filter(user => {
        const isUnverified = !user.email_confirmed_at;
        const isOld = new Date(user.created_at) < sevenDaysAgo;
        return isUnverified && isOld;
      });

      for (const user of usersToClean) {
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
        if (!deleteError) {
          deletedUsers.push(user.email || user.id);
        } else {
          console.error(`Failed to delete unverified user ${user.email || user.id}:`, deleteError);
        }
      }

      if (users.length < 1000) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deletedUsers.length} unverified users who registered more than 7 days ago.`,
      cleanedUsers: deletedUsers
    });

  } catch (error) {
    console.error("Error in user cleanup cron:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}
