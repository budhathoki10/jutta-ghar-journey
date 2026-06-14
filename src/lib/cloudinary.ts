import api from "@/api/axios";
import { resolveImageUrl } from "./image";

export type UploadResult = { url: string; publicId: string };

export async function uploadToCloudinary(
  file: File,
  onProgress?: (p: number) => void,
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/admin/upload-image", formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100,
        );
        onProgress(percent);
      }
    },
  });

  return {
    url: resolveImageUrl(response.data.url),
    publicId: response.data.publicId,
  };
}

export async function deleteUploadedCloudinaryImages(publicIds: string[]) {
  const ids = publicIds.filter(Boolean);
  if (!ids.length) return;

  await api.delete("/admin/upload-image", {
    data: { publicIds: ids },
  });
}
