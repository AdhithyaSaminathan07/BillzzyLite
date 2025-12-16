// import { NextResponse } from "next/server";
// import { v2 as cloudinary, UploadApiResponse } from "cloudinary"; // 1. Import the proper type

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json({ success: false, error: "No file provided." }, { status: 400 });
//     }

//     // Convert file to buffer
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // 2. Use the proper type here instead of 'any'
//     const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder: "billzzy-inventory",
//         },
//         (error, result) => {
//           if (error) {
//             reject(error);
//           } else if (result) {
//             resolve(result);
//           } else {
//             reject(new Error("Upload failed: No result returned"));
//           }
//         }
//       );
//       uploadStream.end(buffer);
//     });

//     // Return the Cloudinary URL
//     return NextResponse.json({ 
//       success: true, 
//       url: uploadResult.secure_url 
//     });

//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json({ success: false, error: "Upload failed." }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configure Cloudinary
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

    // Upload to Cloudinary with compression and type safety
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "billzzy-inventory", // Your folder name
          quality: "auto",             // Auto-compress image size
          fetch_format: "auto",        // Convert to WebP/AVIF automatically
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

    // Return the secure Cloudinary URL
    return NextResponse.json({ 
      success: true, 
      url: uploadResult.secure_url 
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed." }, { status: 500 });
  }
}