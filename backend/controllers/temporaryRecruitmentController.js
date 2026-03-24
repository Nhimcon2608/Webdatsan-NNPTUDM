import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";

function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  return String(value).toLowerCase() === "true";
}

export async function getAllTemporaryRecruitments(req, res) {
  const { branchId, available, reservationId } = req.query;
  let rows = [...(await list("temporaryRecruitments"))];

  if (branchId) {
    rows = rows.filter((item) => item.branchId === branchId);
  }

  if (reservationId) {
    rows = rows.filter((item) => item.reservationId === reservationId);
  }

  if (available !== undefined) {
    rows = rows.filter((item) => item.available === toBoolean(available));
  }

  return ok(res, rows);
}

export async function getTemporaryRecruitmentById(req, res) {
  const row = await findById("temporaryRecruitments", req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, message: "Temporary recruitment not found" });
  }

  if (req.query.include === "branch,reservation" || req.query.include === "full") {
    const [branches, reservations] = await Promise.all([
      list("branches"),
      list("reservations"),
    ]);

    return ok(res, {
      ...row,
      branch: branches.find((item) => item.id === row.branchId) || null,
      reservation: reservations.find((item) => item.id === row.reservationId) || null,
    });
  }

  return ok(res, row);
}

export async function createTemporaryRecruitment(req, res) {
  const createdRow = await insert("temporaryRecruitments", {
    ...req.body,
    available: req.body?.available ?? true,
  });

  return created(res, createdRow, "Temporary recruitment created");
}

export async function updateTemporaryRecruitment(req, res) {
  const { id } = req.params;
  const payload = { ...(req.body || {}) };
  if (payload.available !== undefined) {
    payload.available = toBoolean(payload.available);
  }

  const updated = await updateById("temporaryRecruitments", id, payload);

  if (!updated) {
    return res.status(404).json({ success: false, message: "Temporary recruitment not found" });
  }

  return ok(res, updated, "Temporary recruitment updated");
}
