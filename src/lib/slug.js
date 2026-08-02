// src/lib/slug.js
export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')      // Remove special chars
    .replace(/\s+/g, '-')          // Replace spaces with -
    .replace(/--+/g, '-')          // Replace multiple hyphens
    .trim();
}