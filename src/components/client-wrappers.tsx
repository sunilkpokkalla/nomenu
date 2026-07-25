"use client";

import dynamic from "next/dynamic";

export const ReceiptTracker = dynamic(
  () => import("@/components/menu/receipt-tracker").then(mod => mod.ReceiptTracker),
  { ssr: false }
);

export const FeedbackAnalytics = dynamic(
  () => import("@/app/dashboard/feedback/feedback-analytics").then(mod => mod.FeedbackAnalytics),
  { ssr: false }
);

export const QrDesignerModal = dynamic(
  () => import("@/components/dashboard/qr-designer-modal").then(mod => mod.QrDesignerModal),
  { ssr: false }
);

export const CreateQrSheet = dynamic(
  () => import("@/components/dashboard/create-qr-sheet").then(mod => mod.CreateQrSheet),
  { ssr: false }
);
