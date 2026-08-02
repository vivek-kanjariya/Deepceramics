// src/lib/uploadTile.js
import { supabase } from "./supabase";
import { validateFile, validateMetadata } from "./validation";

// Helper: convert image to WebP
async function convertToWebP(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error("Canvas conversion failed"));
        },
        "image/webp",
        0.85
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

// Helper: generate unique slug
async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    const { data, error } = await supabase
      .from("tiles")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Error checking slug uniqueness:", error);
      break;
    }
    if (!data) {
      exists = false;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }
  return slug;
}

export async function uploadTile(file, metadata) {
  try {
    // 1. Validate file
    const fileCheck = validateFile(file);
    if (!fileCheck.success) {
      console.warn("[uploadTile] File validation failed:", fileCheck.error);
      return fileCheck;
    }

    // 2. Validate metadata
    const metaCheck = validateMetadata(metadata);
    if (!metaCheck.success) {
      console.warn("[uploadTile] Metadata validation failed:", metaCheck.error);
      return metaCheck;
    }

    // 3. Check SKU uniqueness (if provided)
    if (metadata.sku && metadata.sku.trim() !== "") {
      const { data: existingSku, error: skuError } = await supabase
        .from("tiles")
        .select("sku")
        .eq("sku", metadata.sku.trim())
        .maybeSingle();

      if (skuError) {
        console.error("[uploadTile] Error checking SKU:", skuError);
        return { success: false, error: "Error checking SKU uniqueness." };
      }
      if (existingSku) {
        return { success: false, error: `SKU "${metadata.sku}" already exists. Please use a different SKU.` };
      }
    }

    // 4. Convert to WebP
    let webpBlob;
    try {
      console.log("[uploadTile] Converting image to WebP...");
      webpBlob = await convertToWebP(file);
      console.log("[uploadTile] Conversion complete, size:", webpBlob.size);
    } catch (err) {
      console.error("[uploadTile] WebP conversion failed:", err);
      return {
        success: false,
        error: { code: "CONVERSION_FAILED", message: "Image conversion failed." },
      };
    }

    // 5. Upload to Supabase Storage
    const fileName = `${Date.now()}-${crypto.randomUUID()}.webp`;
    console.log("[uploadTile] Uploading to storage:", fileName);

    const { error: uploadError } = await supabase.storage
      .from("tile-images")
      .upload(fileName, webpBlob, { contentType: "image/webp" });

    if (uploadError) {
      console.error("[uploadTile] Storage upload failed:", uploadError);
      return {
        success: false,
        error: { code: "UPLOAD_FAILED", message: "Image upload failed." },
      };
    }

    // 6. Get public URL
    const { data: urlData } = supabase.storage
      .from("tile-images")
      .getPublicUrl(fileName);
    const image_url = urlData.publicUrl;

    // 7. Prepare tile data
    const baseSlug = metadata.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    const tileData = {
      name: metadata.name.trim(),
      sku: metadata.sku?.trim() || null,
      slug: uniqueSlug,
      category_id: parseInt(metadata.category_id, 10),
      size_id: parseInt(metadata.size_id, 10),
      finish_id: parseInt(metadata.finish_id, 10),
      color_id: parseInt(metadata.color_id, 10),
      series_id: metadata.series_id ? parseInt(metadata.series_id, 10) : null,
      thickness_mm: metadata.thickness_mm ? parseFloat(metadata.thickness_mm) : null,
      material: metadata.material?.trim() || null,
      application: metadata.application?.trim() || null,
      faces: metadata.faces ? parseInt(metadata.faces, 10) : 1,
      description: metadata.description?.trim() || null,
      active: metadata.active !== undefined ? metadata.active : true,
      featured: metadata.featured !== undefined ? metadata.featured : false,
      image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("[uploadTile] Inserting tile record:", tileData);

    const { data: inserted, error: dbError } = await supabase
      .from("tiles")
      .insert([tileData])
      .select()
      .single();

    if (dbError) {
      // Rollback: delete uploaded image
      console.error("[uploadTile] DB insert failed, rolling back:", dbError);
      await supabase.storage.from("tile-images").remove([fileName]);

      // Check if it's a duplicate key error
      if (dbError.code === "23505") {
        return {
          success: false,
          error: `Duplicate entry: ${dbError.details || "A unique constraint was violated."}`,
        };
      }
      return {
        success: false,
        error: { code: "DB_FAILED", message: "Failed to save tile metadata: " + dbError.message },
      };
    }

    console.log("[uploadTile] Tile uploaded successfully:", inserted);
    return { success: true, data: inserted };

  } catch (err) {
    console.error("[uploadTile] Unexpected error:", err);
    return {
      success: false,
      error: { code: "UNKNOWN", message: err.message || "Unknown error" },
    };
  }
}