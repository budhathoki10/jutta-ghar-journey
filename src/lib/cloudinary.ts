export type UploadResult = { url: string; publicId: string };

export function uploadToCloudinary(file: File, options: { cloudName: string; uploadPreset: string }, onProgress?: (p: number) => void): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/${options.cloudName}/image/upload`;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', options.uploadPreset);
    fd.append('folder', 'shoe-shop/shoes');

    xhr.open('POST', url);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const res = JSON.parse(xhr.responseText);
            resolve({ url: res.secure_url, publicId: res.public_id });
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.send(fd);
  });
}
