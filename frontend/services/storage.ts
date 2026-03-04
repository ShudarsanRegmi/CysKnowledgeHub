import { auth } from './firebase';

const BASE = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

/**
 * Uploads an image file to the backend (POST /api/upload/image).
 * The backend stores it on disk and returns a public URL.
 * onProgress is called with 0→100 as the XHR progresses.
 */
export async function uploadArticleImage(
  file: File,
  onProgress?: (pct: number) => void,
  type: 'ctf' | 'blog' = 'ctf',
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be authenticated to upload images');

  const idToken = await user.getIdToken();
  const formData = new FormData();
  formData.append('image', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress?.(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.url);
        } catch {
          reject(new Error('Invalid response from upload endpoint'));
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          reject(new Error(data.message ?? `Upload failed (HTTP ${xhr.status})`));
        } catch {
          reject(new Error(`Upload failed (HTTP ${xhr.status})`));
        }
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

    xhr.open('POST', `${BASE}/api/upload/image?type=${type}`);
    xhr.setRequestHeader('Authorization', `Bearer ${idToken}`);
    xhr.send(formData);
  });
}

