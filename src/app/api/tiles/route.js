import { NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { validateTile, validateImage } from "../../../lib/validation";

// ----- Environment & client setup -----
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL");
}
if (!serviceKey && !anonKey) {
  console.error("❌ No Supabase key provided (service role or anon)");
}

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceKey || anonKey,
  {
    auth: { persistSession: false },
  }
);

// ----- Helper: generate a unique slug -----
async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  // Avoid infinite loops – break after 100 attempts
  while (counter < 100) {
    const { data, error } = await supabaseAdmin
      .from("tiles")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("⚠️ Slug check error:", error);
      // Fallback to timestamp if DB query fails
      return `${baseSlug}-${Date.now()}`;
    }
    if (!data) return slug; // slug is unique
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  // Fallback: use timestamp
  return `${baseSlug}-${Date.now()}`;
}

// ----- Main POST handler -----
export async function POST(request) {
  const requestId = crypto.randomUUID().slice(0, 8);
  console.log(`[${requestId}] 🚀 Upload started`);

  try {
    // 1. Parse FormData
    let formData;
    try {
      formData = await request.formData();
    } catch (err) {
      console.error(`[${requestId}] ❌ Failed to parse form data:`, err);
      return NextResponse.json(
        { error: "Invalid form data. Expected multipart/form-data." },
        { status: 400 }
      );
    }

    const file = formData.get("image");
    const metadataRaw = formData.get("metadata");

    // 2. Validate file
    if (!file) {
      return NextResponse.json(
        { error: "Missing image file." },
        { status: 400 }
      );
    }
    const fileCheck = validateImage(file);
    if (!fileCheck.success) {
      return NextResponse.json(
        { error: fileCheck.error || "Invalid image file." },
        { status: 400 }
      );
    }

    // 3. Parse and validate metadata
    let metadata;
    try {
      metadata = JSON.parse(metadataRaw);
    } catch (err) {
      console.error(`[${requestId}] ❌ Invalid JSON in metadata:`, err);
      return NextResponse.json(
        { error: "Invalid metadata format. Must be valid JSON." },
        { status: 400 }
      );
    }

    // Validate required fields (using your validation function)
    const metaCheck = validateTile(metadata);
    if (!metaCheck.success) {
      return NextResponse.json(
        { error: metaCheck.error || "Invalid metadata." },
        { status: 400 }
      );
    }

    // Additional manual checks for critical fields
    const required = ["name", "category_id", "size_id", "finish_id", "color_id"];
    for (const field of required) {
      if (!metadata[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    console.log(`[${requestId}] ✅ Metadata valid:`, metadata);

    // 4. Convert image to WebP
    let buffer, webpBuffer;
    try {
      buffer = Buffer.from(await file.arrayBuffer());
      webpBuffer = await sharp(buffer)
        .webp({ quality: 85 })
        .toBuffer();
      console.log(`[${requestId}] ✅ Image converted to WebP (${webpBuffer.length} bytes)`);
    } catch (err) {
      console.error(`[${requestId}] ❌ Image processing error:`, err);
      return NextResponse.json(
        { error: "Image conversion failed: " + err.message },
        { status: 500 }
      );
    }

    // 5. Upload to Supabase Storage
    const fileName = `${Date.now()}-${crypto.randomUUID()}.webp`;
    let uploadError;
    try {
      const { error } = await supabaseAdmin.storage
        .from("tile-images")
        .upload(fileName, webpBuffer, {
          contentType: "image/webp",
          cacheControl: "3600",
        });
      uploadError = error;
    } catch (err) {
      uploadError = err;
    }

    if (uploadError) {
      console.error(`[${requestId}] ❌ Storage upload error:`, uploadError);
      return NextResponse.json(
        { error: "Storage upload failed: " + uploadError.message },
        { status: 500 }
      );
    }

    // 6. Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("tile-images")
      .getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;
    console.log(`[${requestId}] ✅ Image uploaded: ${imageUrl}`);

    // 7. Generate unique slug
    const baseSlug = metadata.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    let slug;
    try {
      slug = await generateUniqueSlug(baseSlug);
      console.log(`[${requestId}] ✅ Slug generated: ${slug}`);
    } catch (err) {
      console.error(`[${requestId}] ❌ Slug generation error:`, err);
      // Fallback to timestamp
      slug = `${baseSlug}-${Date.now()}`;
    }

    // 8. Build tile data object
    const tileData = {
      name: metadata.name.trim(),
      sku: metadata.sku?.trim() || null,
      slug,
      category_id: parseInt(metadata.category_id, 10),
      size_id: parseInt(metadata.size_id, 10),
      finish_id: parseInt(metadata.finish_id, 10),
      color_id: parseInt(metadata.color_id, 10),
      series_id: metadata.series_id ? parseInt(metadata.series_id, 10) : null,
      thickness_mm: metadata.thickness_mm ? parseFloat(metadata.thickness_mm) : null,
      material: metadata.material?.trim() || null,
      application: metadata.application?.trim() || null,
      faces: parseInt(metadata.faces, 10) || 1,
      description: metadata.description?.trim() || null,
      active: metadata.active !== undefined ? Boolean(metadata.active) : true,
      featured: metadata.featured !== undefined ? Boolean(metadata.featured) : false,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 9. Insert into Supabase
    let dbError;
    try {
      const { error } = await supabaseAdmin
        .from("tiles")
        .insert([tileData]);
      dbError = error;
    } catch (err) {
      dbError = err;
    }

    if (dbError) {
      console.error(`[${requestId}] ❌ DB insert error:`, dbError);

      // Rollback: delete the uploaded image
      try {
        await supabaseAdmin.storage.from("tile-images").remove([fileName]);
        console.log(`[${requestId}] 🧹 Rollback: deleted orphan image ${fileName}`);
      } catch (rollbackErr) {
        console.error(`[${requestId}] ⚠️ Rollback failed:`, rollbackErr);
        // We log but don't fail the response – the main error is the DB issue.
      }

      return NextResponse.json(
        { error: "Database insert failed: " + dbError.message },
        { status: 500 }
      );
    }

    console.log(`[${requestId}] ✅ Tile created successfully`);
    return NextResponse.json(
      { success: true, data: tileData },
      { status: 201 }
    );

  } catch (err) {
    // Catch any unexpected errors
    console.error(`[${requestId}] 💥 Unhandled error:`, err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}