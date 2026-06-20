"use client";

import React from "react";

import { Wifi } from "lucide-react";

import { QrTemplateProps } from '../../types';

export const CasualFonts = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Quicksand:wght@400;500;600;700&family=Pacifico&display=swap');
    .font-nunito { font-family: 'Nunito', sans-serif; }
    .font-quicksand { font-family: 'Quicksand', sans-serif; }
    .font-pacifico { font-family: 'Pacifico', cursive; }
  `}} />
);

export const Spoon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 100" fill="currentColor">
    <ellipse cx="12" cy="20" rx="9" ry="18" />
    <rect x="10" y="35" width="4" height="55" rx="2" />
    <circle cx="12" cy="90" r="3" />
  </svg>
);

export const Fork = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 100" fill="currentColor">
    <path d="M4 5 L4 25 A 8 8 0 0 0 20 25 L20 5 M9.3 5 L9.3 25 M14.7 5 L14.7 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <rect x="10.5" y="33" width="3" height="57" rx="1.5" />
    <circle cx="12" cy="90" r="2.5" />
  </svg>
);