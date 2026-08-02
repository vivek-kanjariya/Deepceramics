// src/lib/validation.js

// ----- Validate image file (used by uploadTile) -----
export function validateFile(file) {
  if (!file) return { success: false, error: "No file selected" };
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "File must be an image" };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "Image must be less than 5MB" };
  }
  return { success: true };
}

// ----- Validate image for API route (more permissive) -----
export function validateImage(file) {
  if (!file) {
    return { success: false, error: 'No image file provided' };
  }
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/octet-stream' // fallback for ambiguous files
  ];
  if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
    return {
      success: false,
      error: `Unsupported file type: "${file.type}". Allowed: ${allowedTypes.join(', ')}`
    };
  }
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { success: false, error: `Image must be less than ${maxSize / 1024 / 1024}MB` };
  }
  return { success: true };
}

// ----- Validate metadata (used by uploadTile) -----
export function validateMetadata(data) {
  // Reuse the same rules as validateTile
  return validateTile(data);
}

// ----- Validate tile metadata for API route -----
export function validateTile(data) {
  const required = ['name', 'category_id', 'size_id', 'finish_id', 'color_id'];
  for (const field of required) {
    const value = data[field];
    if (value === undefined || value === null || value.toString().trim() === '') {
      return { success: false, error: `${field} is required` };
    }
  }

  const idFields = ['category_id', 'size_id', 'finish_id', 'color_id', 'series_id'];
  for (const field of idFields) {
    if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
      if (isNaN(Number(data[field]))) {
        return { success: false, error: `${field} must be a number` };
      }
    }
  }

  return { success: true };
}