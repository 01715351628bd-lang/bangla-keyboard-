import JSZip from "jszip";
import { ANDROID_PROJECT_FILES } from "../data/projectFiles";

/**
 * Packs all native Android project files into a ready-to-build ZIP archive
 * and triggers immediate browser download.
 */
export async function downloadProjectZip(onProgress?: (percent: number) => void) {
  const zip = new JSZip();

  // Root folder in the zip
  const root = zip.folder("KothaProBanglaKeyboard") || zip;

  for (let i = 0; i < ANDROID_PROJECT_FILES.length; i++) {
    const file = ANDROID_PROJECT_FILES[i];
    root.file(file.fullRepoPath, file.content);
    if (onProgress) {
      onProgress(Math.round(((i + 1) / ANDROID_PROJECT_FILES.length) * 50));
    }
  }

  const blob = await zip.generateAsync(
    { type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } },
    (metadata) => {
      if (onProgress) {
        onProgress(50 + Math.round(metadata.percent * 0.5));
      }
    }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "KothaProBanglaKeyboard-src.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
