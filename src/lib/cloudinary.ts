import api from '@/api/axios';

export type UploadResult = { url: string; publicId: string };

export async function uploadToCloudinary(file: File, onProgress?: (p: number) => void): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/admin/upload-image', formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onProgress(percent);
      }
    },
  });

  return {
    url: response.data.url,
    publicId: response.data.publicId,
  };
}
