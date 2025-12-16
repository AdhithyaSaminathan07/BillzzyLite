// import { NextRequest, NextResponse } from "next/server";
// import { writeFile, mkdir } from "fs/promises";
// import { join } from "path";

// export async function POST(req: NextRequest) {
//   const data = await req.formData();
//   const file: File | null = data.get('file') as unknown as File;

//   if (!file) {
//     return NextResponse.json({ success: false, error: "No file provided." });
//   }

//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);

//   // Define the directory path where images will be stored
//   const uploadsDir = join(process.cwd(), "public/uploads");

//   try {
//     // --- FIX: Ensure the upload directory exists ---
//     // The `recursive: true` option creates parent directories if needed
//     // and doesn't throw an error if the directory already exists.
//     await mkdir(uploadsDir, { recursive: true });

//     // Create a unique filename and the full path
//     const filename = `${Date.now()}-${file.name}`;
//     const path = join(uploadsDir, filename);

//     // Write the file to the ensured directory
//     await writeFile(path, buffer);
//     console.log(`File saved to ${path}`);

//     // Return the public path to be stored in the database
//     return NextResponse.json({ success: true, path: `/uploads/${filename}` });

//   } catch (error) {
//     console.error("Error saving file:", error);
//     return NextResponse.json({ success: false, error: "Failed to save file." });
//   }
// }

import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"; // 1. Import the proper type

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided." }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Use the proper type here instead of 'any'
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "billzzy-inventory",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error("Upload failed: No result returned"));
          }
        }
      );
      uploadStream.end(buffer);
    });

    // Return the Cloudinary URL
    return NextResponse.json({ 
      success: true, 
      url: uploadResult.secure_url 
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed." }, { status: 500 });
  }
}