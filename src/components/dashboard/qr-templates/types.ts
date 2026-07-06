export interface QrTemplateProps {
  brandName: string;
  headline: string;
  subtext: string;
  wifiPassword?: string | null;
  logoUrl?: string | null;
  qrImageUrl: string;
  qrDataUrl?: string;
  qrColor?: string;
  colorStart: string;
  colorEnd: string;
  id?: string;
}

export type TemplateCategory = 'Legacy' | 'Fine Dining' | 'Minimalist' | 'Nightlife' | 'Casual' | 'Creative';

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  component: React.FC<QrTemplateProps>;
  isPremium?: boolean;
}

export interface QrTemplateCategory {
  id: string;
  name: string;
  templates: { id: string; name: string }[];
}
