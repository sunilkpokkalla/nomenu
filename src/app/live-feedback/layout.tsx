import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Feedback | NoMenu",
  description: "Standalone Live Feedback System.",
};

export default function LiveFeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans">
      {children}
    </div>
  );
}
