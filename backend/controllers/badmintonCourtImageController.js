// Lưu và xóa metadata ảnh cho từng badminton court.
import { created, ok } from "../utils/response.js";
import { list, updateById } from "../utils/store.js";
import { deleteUploadedFile, persistUploadedFile } from "../utils/uploadStorage.js";

function getUploadedFile(req) {
  return req.file || req.files?.[0] || null;
}

export async function uploadCourtImage(req, res) {
  // File upload được lưu theo court id để danh sách ảnh luôn gắn với đúng sân.
  const badmintonCourtId = req.body?.badmintonCourtId || req.body?.courtId;

  if (!badmintonCourtId) {
    return res.status(400).json({ success: false, message: "badmintonCourtId is required" });
  }

  const court = (await list("badmintonCourts")).find((item) => item.id === badmintonCourtId);
  if (!court) {
    return res.status(404).json({ success: false, message: "Court not found" });
  }

  const file = getUploadedFile(req);
  const imagePath =
    (await persistUploadedFile(file, ["courts", badmintonCourtId])) || req.body?.url || "";
  const image = {
    id: `img-${Date.now()}`,
    name: file?.originalname || req.body?.imageName || "court-image",
    imagePath,
    url: imagePath,
  };

  const updated = await updateById("badmintonCourts", badmintonCourtId, {
    images: [...(court.images || []), image],
  });

  return created(res, { court: updated, image }, "Court image uploaded");
}

export async function deleteCourtImage(req, res) {
  const { badmintonCourtId, imageId } = req.params;
  const court = (await list("badmintonCourts")).find((item) => item.id === badmintonCourtId);

  if (!court) {
    return res.status(404).json({ success: false, message: "Court not found" });
  }

  const imageToDelete = (court.images || []).find((img) => img.id === imageId);
  const images = (court.images || []).filter((img) => img.id !== imageId);

  await deleteUploadedFile(imageToDelete?.imagePath || imageToDelete?.url);
  const updated = await updateById("badmintonCourts", badmintonCourtId, { images });

  return ok(res, updated, "Court image deleted");
}
