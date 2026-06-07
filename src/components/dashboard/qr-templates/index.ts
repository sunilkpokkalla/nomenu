import { QrTemplateProps, QrTemplateCategory } from './types';

import * as NightlifeTemplates from './nightlife';
import * as MinimalistTemplates from './minimalist';
import * as FineDiningTemplates from './fine-dining';
import * as CreativeTemplates from './creative';
import * as CasualTemplates from './casual';
import * as LuminaTemplates from './lumina';
import * as LegacyTemplates from './legacy';

export type TemplateKey = 
  | 'neon-tube'  | 'dark-club'  | 'cyberpunk'  | 'liquid-night'  | 'speak-easy'
  | 'laser-grid'  | 'synthwave'  | 'v-i-p-lounge'  | 'industrial-techno'  | 'abstract-bass'
  | 'swiss-grid'  | 'pure-whitespace'  | 'negative-space'  | 'bauhaus'  | 'the-exhibition'
  | 'typographic-hierarchy'  | 'outline-minimal'  | 'editorial'  | 'data-minimal'  | 'zen-center'
  | 'the-michelin'  | 'the-sommelier'  | 'omakase-minimal'  | 'the-chandelier'  | 'french-bistro'
  | 'modern-steakhouse'  | 'the-botanical'  | 'velvet-noir'  | 'classical-heritage'  | 'the-monolith'
  | 'fluid-gradient'  | 'brutalist-pop'  | 'glass-orbs'  | 'funky-retro'  | 'y2-k-aesthetic'
  | 'architectural'  | 'holographic'  | 'monospace-terminal'  | 'pop-art'  | 'split-screen'
  | 'morning-coffee'  | 'the-bakery'  | 'craft-burger'  | 'urban-cafe'  | 'sunday-brunch'
  | 'local-pub'  | 'pizzeria'  | 'juice-bar'  | 'retro-diner'  | 'cozy-teahouse'
  | 'classic'  | 'instagram-square'  | 'minimalist'  | 'neon-cyber'  | 'luxury-gold'
  | 'brutalist'  | 'claymorphism'  | 'art-deco'  | 'modern-glass'  | 'polaroid-snapshot'
  | 'bistro-gold' | 'lumina-bistro';

export const templates: Record<TemplateKey, React.ComponentType<QrTemplateProps>> = {
  'neon-tube': NightlifeTemplates.NeonTube,
  'dark-club': NightlifeTemplates.DarkClub,
  'cyberpunk': NightlifeTemplates.Cyberpunk,
  'liquid-night': NightlifeTemplates.LiquidNight,
  'speak-easy': NightlifeTemplates.SpeakEasy,
  'laser-grid': NightlifeTemplates.LaserGrid,
  'synthwave': NightlifeTemplates.Synthwave,
  'v-i-p-lounge': NightlifeTemplates.VIPLounge,
  'industrial-techno': NightlifeTemplates.IndustrialTechno,
  'abstract-bass': NightlifeTemplates.AbstractBass,
  'swiss-grid': MinimalistTemplates.SwissGrid,
  'pure-whitespace': MinimalistTemplates.PureWhitespace,
  'negative-space': MinimalistTemplates.NegativeSpace,
  'bauhaus': MinimalistTemplates.Bauhaus,
  'the-exhibition': MinimalistTemplates.TheExhibition,
  'typographic-hierarchy': MinimalistTemplates.TypographicHierarchy,
  'outline-minimal': MinimalistTemplates.OutlineMinimal,
  'editorial': MinimalistTemplates.Editorial,
  'data-minimal': MinimalistTemplates.DataMinimal,
  'zen-center': MinimalistTemplates.ZenCenter,
  'the-michelin': FineDiningTemplates.TheMichelin,
  'the-sommelier': FineDiningTemplates.TheSommelier,
  'omakase-minimal': FineDiningTemplates.OmakaseMinimal,
  'the-chandelier': FineDiningTemplates.TheChandelier,
  'french-bistro': FineDiningTemplates.FrenchBistro,
  'modern-steakhouse': FineDiningTemplates.ModernSteakhouse,
  'the-botanical': FineDiningTemplates.TheBotanical,
  'velvet-noir': FineDiningTemplates.VelvetNoir,
  'classical-heritage': FineDiningTemplates.ClassicalHeritage,
  'the-monolith': FineDiningTemplates.TheMonolith,
  'fluid-gradient': CreativeTemplates.FluidGradient,
  'brutalist-pop': CreativeTemplates.BrutalistPop,
  'glass-orbs': CreativeTemplates.GlassOrbs,
  'funky-retro': CreativeTemplates.FunkyRetro,
  'y2-k-aesthetic': CreativeTemplates.Y2KAesthetic,
  'architectural': CreativeTemplates.Architectural,
  'holographic': CreativeTemplates.Holographic,
  'monospace-terminal': CreativeTemplates.MonospaceTerminal,
  'pop-art': CreativeTemplates.PopArt,
  'split-screen': CreativeTemplates.SplitScreen,
  'morning-coffee': CasualTemplates.MorningCoffee,
  'the-bakery': CasualTemplates.TheBakery,
  'craft-burger': CasualTemplates.CraftBurger,
  'urban-cafe': CasualTemplates.UrbanCafe,
  'sunday-brunch': CasualTemplates.SundayBrunch,
  'local-pub': CasualTemplates.LocalPub,
  'pizzeria': CasualTemplates.Pizzeria,
  'juice-bar': CasualTemplates.JuiceBar,
  'retro-diner': CasualTemplates.RetroDiner,
  'cozy-teahouse': CasualTemplates.CozyTeahouse,
  'classic': LegacyTemplates.ClassicPortrait,
  'instagram-square': LegacyTemplates.InstagramSquare,
  'minimalist': LegacyTemplates.Minimalist,
  'neon-cyber': LegacyTemplates.NeonCyber,
  'luxury-gold': LegacyTemplates.LuxuryGold,
  'brutalist': LegacyTemplates.Brutalist,
  'claymorphism': LegacyTemplates.Claymorphism,
  'art-deco': LegacyTemplates.ArtDeco,
  'modern-glass': LegacyTemplates.ModernGlass,
  'polaroid-snapshot': LegacyTemplates.PolaroidSnapshot,
  'bistro-gold': LegacyTemplates.BistroGold,
  'lumina-bistro': LuminaTemplates.LuminaBistro,
};

export const templateCategories: QrTemplateCategory[] = [
  {
    id: 'nightlife',
    name: 'Nightlife',
    templates: [
      { id: 'neon-tube', name: 'Neon Tube' },
      { id: 'dark-club', name: 'Dark Club' },
      { id: 'cyberpunk', name: 'Cyberpunk' },
      { id: 'liquid-night', name: 'Liquid Night' },
      { id: 'speak-easy', name: 'Speak Easy' },
      { id: 'laser-grid', name: 'Laser Grid' },
      { id: 'synthwave', name: 'Synthwave' },
      { id: 'v-i-p-lounge', name: 'V I P Lounge' },
      { id: 'industrial-techno', name: 'Industrial Techno' },
      { id: 'abstract-bass', name: 'Abstract Bass' },
    ]
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    templates: [
      { id: 'swiss-grid', name: 'Swiss Grid' },
      { id: 'pure-whitespace', name: 'Pure Whitespace' },
      { id: 'negative-space', name: 'Negative Space' },
      { id: 'bauhaus', name: 'Bauhaus' },
      { id: 'the-exhibition', name: 'The Exhibition' },
      { id: 'typographic-hierarchy', name: 'Typographic Hierarchy' },
      { id: 'outline-minimal', name: 'Outline Minimal' },
      { id: 'editorial', name: 'Editorial' },
      { id: 'data-minimal', name: 'Data Minimal' },
      { id: 'zen-center', name: 'Zen Center' },
    ]
  },
  {
    id: 'fine-dining',
    name: 'Fine Dining',
    templates: [
      { id: 'the-michelin', name: 'The Michelin' },
      { id: 'the-sommelier', name: 'The Sommelier' },
      { id: 'omakase-minimal', name: 'Omakase Minimal' },
      { id: 'the-chandelier', name: 'The Chandelier' },
      { id: 'french-bistro', name: 'French Bistro' },
      { id: 'modern-steakhouse', name: 'Modern Steakhouse' },
      { id: 'the-botanical', name: 'The Botanical' },
      { id: 'velvet-noir', name: 'Velvet Noir' },
      { id: 'classical-heritage', name: 'Classical Heritage' },
      { id: 'the-monolith', name: 'The Monolith' },
    ]
  },
  {
    id: 'creative',
    name: 'Creative',
    templates: [
      { id: 'fluid-gradient', name: 'Fluid Gradient' },
      { id: 'brutalist-pop', name: 'Brutalist Pop' },
      { id: 'glass-orbs', name: 'Glass Orbs' },
      { id: 'funky-retro', name: 'Funky Retro' },
      { id: 'y2-k-aesthetic', name: 'Y2 K Aesthetic' },
      { id: 'architectural', name: 'Architectural' },
      { id: 'holographic', name: 'Holographic' },
      { id: 'monospace-terminal', name: 'Monospace Terminal' },
      { id: 'pop-art', name: 'Pop Art' },
      { id: 'split-screen', name: 'Split Screen' },
    ]
  },
  {
    id: 'casual',
    name: 'Casual',
    templates: [
      { id: 'morning-coffee', name: 'Morning Coffee' },
      { id: 'the-bakery', name: 'The Bakery' },
      { id: 'craft-burger', name: 'Craft Burger' },
      { id: 'urban-cafe', name: 'Urban Cafe' },
      { id: 'sunday-brunch', name: 'Sunday Brunch' },
      { id: 'local-pub', name: 'Local Pub' },
      { id: 'pizzeria', name: 'Pizzeria' },
      { id: 'juice-bar', name: 'Juice Bar' },
      { id: 'retro-diner', name: 'Retro Diner' },
      { id: 'cozy-teahouse', name: 'Cozy Teahouse' },
      { id: 'lumina-bistro', name: 'Lumina Bistro' },
    ]
  },
  {
    id: 'legacy',
    name: 'Legacy (Original)',
    templates: [
      { id: 'classic', name: 'Classic Portrait' },
      { id: 'instagram-square', name: 'Instagram Square' },
      { id: 'minimalist', name: 'Minimalist' },
      { id: 'neon-cyber', name: 'Neon Cyber' },
      { id: 'luxury-gold', name: 'Luxury Gold' },
      { id: 'brutalist', name: 'Brutalist' },
      { id: 'claymorphism', name: 'Claymorphism' },
      { id: 'art-deco', name: 'Art Deco' },
      { id: 'modern-glass', name: 'Modern Glass' },
      { id: 'polaroid-snapshot', name: 'Polaroid Snapshot' },
      { id: 'bistro-gold', name: 'Bistro Gold' },
    ]
  },
];
