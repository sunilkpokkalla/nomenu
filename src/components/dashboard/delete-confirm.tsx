"use client";

import { ReactNode } from "react";

interface DeleteConfirmProps {
  action: (formData: FormData) => void;
  confirmMessage: string;
  name: string;
  value: string;
  children: ReactNode;
}

export function DeleteConfirmForm({ action, confirmMessage, name, value, children }: DeleteConfirmProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!window.confirm(confirmMessage)) {
      e.preventDefault();
    }
  };

  return (
    <form action={action} onSubmit={handleSubmit}>
      <input type="hidden" name={name} value={value} />
      {children}
    </form>
  );
}
