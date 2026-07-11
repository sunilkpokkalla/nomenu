import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Front of House | NoMenu",
  description: "Standalone Front of House System.",
};

export default function FOHLayout({
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
