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

export const OrdersBoardWrapper = dynamic(
  () => import("@/app/dashboard/orders/orders-board").then(mod => mod.OrdersBoard),
  { ssr: false }
);

export const TakeawayBoardWrapper = dynamic(
  () => import("@/app/dashboard/takeaway/takeaway-board").then(mod => mod.TakeawayBoard),
  { ssr: false }
);

export const ReservationsBoardWrapper = dynamic(
  () => import("@/app/dashboard/reservations/reservations-board").then(mod => mod.ReservationsBoard),
  { ssr: false }
);

export const CashierBoardWrapper = dynamic(
  () => import("@/app/dashboard/cashier/cashier-board").then(mod => mod.CashierBoard),
  { ssr: false }
);

export const CompletedBoardWrapper = dynamic(
  () => import("@/app/dashboard/cashier/completed-board").then(mod => mod.CompletedBoard),
  { ssr: false }
);

export const WaitlistBoardWrapper = dynamic(
  () => import("@/app/dashboard/cashier/waitlist-board").then(mod => mod.WaitlistBoard),
  { ssr: false }
);

export const FloorPlanBoardWrapper = dynamic(
  () => import("@/app/dashboard/cashier/floor-plan-board").then(mod => mod.FloorPlanBoard),
  { ssr: false }
);
