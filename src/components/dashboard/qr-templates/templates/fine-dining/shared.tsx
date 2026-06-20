"use client";

import React from "react";

import { Wifi } from "lucide-react";

import { QrTemplateProps } from '../../types';

export const FineDiningFonts = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;1,6..96,400&display=swap');
    .font-playfair { font-family: 'Playfair Display', serif; }
    .font-cormorant { font-family: 'Cormorant Garamond', serif; }
    .font-bodoni { font-family: 'Bodoni Moda', serif; }
  `}} />
);