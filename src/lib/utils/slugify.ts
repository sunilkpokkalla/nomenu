export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')                   // Decompose accented characters into base char + accent
    .replace(/[\u0300-\u036f]/g, '')    // Remove the accent modifiers
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')               // Replace spaces with -
    .replace(/[^\w\-]+/g, '')           // Remove all non-word chars
    .replace(/\-\-+/g, '-');            // Replace multiple - with single -
}
