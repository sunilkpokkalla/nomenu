"use client";

import React from "react";

import { Wifi } from "lucide-react";

import { QrTemplateProps } from '../../types';

import { DottedQRCode } from '../../dotted-qr';

export const LuminaFonts = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Inter:wght@400;500;600;700&display=swap');
    .font-outfit { font-family: 'Outfit', sans-serif; }
    .font-inter { font-family: 'Inter', sans-serif; }
  `}} />
);