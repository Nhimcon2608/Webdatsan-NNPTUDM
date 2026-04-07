// Tập trung logic lưu file upload, tạo path an toàn và dọn file.
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = path.resolve(CURRENT_DIR, "..");
const UPLOADS_ROOT = path.join(BACKEND_ROOT, "uploads");

function sanitizePathSegment(value, fallback = "file") {
  const normalized = String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || fallback;
}

function buildStoredFilename(originalname = "upload.bin") {
  const extension = path.extname(originalname || "").toLowerCase();
  const basename = path.basename(originalname || "upload", extension);
  const safeBasename = sanitizePathSegment(basename, "upload");
  return `${safeBasename}-${Date.now()}${extension}`;
}

export function getUploadsRoot() {
  return UPLOADS_ROOT;
}

export async function persistUploadedFile(file, directorySegments = []) {
  // Trả về public path để frontend tham chiếu file qua static mount của Express.
  if (!file?.buffer) {
    return null;
  }

  const safeSegments = directorySegments.map((segment) => sanitizePathSegment(segment)).filter(Boolean);
  const targetDirectory = path.join(UPLOADS_ROOT, ...safeSegments);
  const filename = buildStoredFilename(file.originalname);

  await fs.mkdir(targetDirectory, { recursive: true });
  await fs.writeFile(path.join(targetDirectory, filename), file.buffer);

  return `/${path.posix.join("uploads", ...safeSegments, filename)}`;
}

export async function deleteUploadedFile(publicPath) {
  // Chỉ cho phép xóa file nằm trong uploads root.
  if (!publicPath || !String(publicPath).startsWith("/uploads/")) {
    return;
  }

  const relativePath = String(publicPath).replace(/^\/+/, "");
  const absolutePath = path.resolve(BACKEND_ROOT, relativePath);

  if (!absolutePath.startsWith(UPLOADS_ROOT)) {
    return;
  }

  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}
