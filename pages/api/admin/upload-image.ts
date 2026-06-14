import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import { IncomingForm } from "formidable";
import { verifyToken } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const readJsonBody = async (req: NextApiRequest) => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (!chunks.length) return {};

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Token invalid" });
    }

    if (req.method === "DELETE") {
      const body = await readJsonBody(req);
      const publicIds = Array.isArray(body?.publicIds)
        ? body.publicIds.filter(
            (id: unknown) => typeof id === "string" && id.trim(),
          )
        : [];

      if (!publicIds.length) {
        return res.status(400).json({ message: "No image ids provided" });
      }

      await Promise.allSettled(
        publicIds.map((publicId: string) =>
          cloudinary.uploader.destroy(publicId, { resource_type: "image" }),
        ),
      );

      return res.status(200).json({ deleted: publicIds.length });
    }

    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: "shoe_shop",
      resource_type: "auto",
      use_filename: true,
    });

    return res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
      filename: file.originalFilename,
      cloudinaryUrl: result.secure_url,
    });
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    return res
      .status(500)
      .json({ message: "Upload failed", error: err.message });
  }
}
