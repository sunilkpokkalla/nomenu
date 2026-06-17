"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AdminPagination({ total, pageSize }: { total: number; pageSize: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(total / pageSize);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-black/50">
      <span className="text-sm text-neutral-400">
        Showing <span className="font-medium text-white">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * pageSize, total)}</span> of <span className="font-medium text-white">{total}</span> results
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-neutral-400 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1 text-sm font-medium">
          <span className="text-white px-2">{currentPage}</span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-400 px-2">{totalPages}</span>
        </div>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-neutral-400 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
