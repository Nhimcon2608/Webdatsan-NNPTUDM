import { created, ok } from "../utils/response.js";
import { list, updateById } from "../utils/store.js";

export function uploadCourtImage(req, res) {
  const badmintonCourtId = req.body?.badmintonCourtId || req.body?.courtId;

  if (!badmintonCourtId) {
    return res.status(400).json({ success: false, message: "badmintonCourtId is required" });
  }

  const court = list("badmintonCourts").find((item) => item.id === badmintonCourtId);
  if (!court) {
    return res.status(404).json({ success: false, message: "Court not found" });
  }

  const image = {
    id: `img-${Date.now()}`,
    name: req.file?.originalname || req.body?.imageName || "court-image",
    url: req.file?.originalname
      ? `/uploads/courts/${badmintonCourtId}/${req.file.originalname}`
      : req.body?.url || "",
  };

  const updated = updateById("badmintonCourts", badmintonCourtId, {
    images: [...(court.images || []), image],
  });

  return created(res, { court: updated, image }, "Court image uploaded");
}

export function deleteCourtImage(req, res) {
  const { badmintonCourtId, imageId } = req.params;
  const court = list("badmintonCourts").find((item) => item.id === badmintonCourtId);

  if (!court) {
    return res.status(404).json({ success: false, message: "Court not found" });
  }

  const images = (court.images || []).filter((img) => img.id !== imageId);
  const updated = updateById("badmintonCourts", badmintonCourtId, { images });

  return ok(res, updated, "Court image deleted");
}
