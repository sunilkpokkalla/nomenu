"use client";

import React from "react";

import { Wifi } from "lucide-react";

import { QrTemplateProps } from '../../types';

export const MinimalistFonts = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;900&family=Space+Grotesk:wght@300;400;600;700&family=Outfit:wght@300;400;600;800&display=swap');
    .font-inter { font-family: 'Inter', sans-serif; }
    .font-space { font-family: 'Space Grotesk', sans-serif; }
    .font-outfit { font-family: 'Outfit', sans-serif; }
  `}} />
);