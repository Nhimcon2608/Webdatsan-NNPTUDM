import { created, ok } from "../utils/response.js";
import { insert, list, removeById } from "../utils/store.js";

export async function getSavedTemporaryRecruitments(req, res) {
  const accountId = req.context.accountId;
  const rows = (await list("temporaryRecruitmentSaved")).filter(
    (item) => item.accountId === accountId,
  );
  return ok(res, rows);
}

export async function saveTemporaryRecruitment(req, res) {
  const accountId = req.context.accountId;
  const temporaryRecruitmentId = req.body?.temporaryRecruitmentId;

  if (!temporaryRecruitmentId) {
    return res.status(400).json({ success: false, message: "temporaryRecruitmentId is required" });
  }

  const createdRow = await insert("temporaryRecruitmentSaved", {
    accountId,
    temporaryRecruitmentId,
  });

  return created(res, createdRow, "Saved temporary recruitment");
}

export async function unsaveTemporaryRecruitment(req, res) {
  const { temporaryRecruitmentId } = req.params;
  const accountId = req.context.accountId;

  const current = (await list("temporaryRecruitmentSaved")).find(
    (item) =>
      item.accountId === accountId && item.temporaryRecruitmentId === temporaryRecruitmentId,
  );

  if (!current) {
    return res.status(404).json({ success: false, message: "Saved record not found" });
  }

  await removeById("temporaryRecruitmentSaved", current.id);
  return ok(res, current, "Unsaved temporary recruitment");
}
