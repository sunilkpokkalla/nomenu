import { createClient as createAdminClient } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Mail, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function AdminSupportPage() {
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  const { data: tickets, error } = await adminSupabase
    .from("support_tickets")
    .select("*, restaurants(name, owner_id)")
    .order("created_at", { ascending: false });

  if (error) {
    // If the table doesn't exist yet, show a nice empty state instead of crashing
    if (error.code === '42P01') {
      return (
        <div className="p-16 flex flex-col items-center justify-center text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Support Hub Not Initialized</h2>
          <p className="text-slate-500 mt-2 max-w-md">The support_tickets table does not exist. Please run the migration.</p>
        </div>
      );
    }
    return <div className="text-red-500 p-8">Error loading tickets: {error.message}</div>;
  }

  // Fetch emails
  const ownerIds = [...new Set(tickets?.map(t => (t.restaurants as { owner_id: string } | null)?.owner_id).filter(Boolean) as string[])];
  const userResponses = await Promise.all(
    ownerIds.map(id => adminSupabase.auth.admin.getUserById(id))
  );
  
  const emailsMap = userResponses.reduce((acc, res) => {
    if (res.data?.user?.id && res.data.user.email) {
      acc[res.data.user.id] = res.data.user.email;
    }
    return acc;
  }, {} as Record<string, string>);

  const ticketList = tickets || [];
  const openTickets = ticketList.filter(t => t.status === 'open').length;

  return (
    <div className="space-y-8 font-sans-vibrant">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Support & Feedback</h1>
          <p className="mt-1 text-slate-500 font-medium">Manage incoming help requests from restaurant owners.</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            {openTickets > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${openTickets > 0 ? 'bg-indigo-500' : 'bg-slate-300'}`}></span>
          </span>
          <span className="font-bold text-indigo-700">{openTickets} Open Tickets</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Restaurant</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ticketList.map((ticket) => {
                const ownerId = (ticket.restaurants as { owner_id: string } | null)?.owner_id;
                const email = ownerId ? emailsMap[ownerId] : null;

                return (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5 align-top">
                      {ticket.status === 'open' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-50 text-amber-600 border border-amber-200">
                          <Circle className="w-3 h-3 fill-amber-500 text-amber-500" />
                          Open
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-100 text-slate-500 border border-slate-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Closed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 align-top">
                      <p className="font-bold text-slate-900">{(ticket.restaurants as { name: string } | null)?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500 mt-1">{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-800 mb-1">{ticket.subject}</p>
                      <p className="text-slate-600 whitespace-pre-wrap">{ticket.message}</p>
                    </td>
                    <td className="px-6 py-5 text-right align-top">
                      <div className="flex items-center justify-end gap-2">
                        {email && (
                          <a href={`mailto:${email}?subject=Re: ${ticket.subject}`}>
                            <Button size="sm" variant="outline" className="h-8">
                              <Mail className="w-4 h-4 mr-2" />
                              Reply
                            </Button>
                          </a>
                        )}
                        {/* We would normally have a server action here to toggle status */}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {ticketList.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-0">
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                        <MessageSquare className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">No support tickets</h3>
                      <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                        You have no incoming help requests. When a restaurant submits a ticket, it will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
