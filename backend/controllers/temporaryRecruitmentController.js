import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";
import {
  buildTemporaryRecruitmentContext,
  serializeTemporaryRecruitment,
} from "../utils/temporaryRecruitmentView.js";

function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  return String(value).toLowerCase() === "true";
}

export async function getAllTemporaryRecruitments(req, res) {
  const { branchId, available, reservationId } = req.query;
  const context = await buildTemporaryRecruitmentContext();
  let rows = context.temporaryRecruitments.map((item) => serializeTemporaryRecruitment(item, context));

  if (branchId) {
    rows = rows.filter((item) => item?.branchId === branchId);
  }

  if (reservationId) {
    rows = rows.filter((item) => item?.reservationId === reservationId);
  }

  if (available !== undefined) {
    rows = rows.filter((item) => item?.available === toBoolean(available));
  }

  return ok(res, rows);
}

export async function getTemporaryRecruitmentById(req, res) {
  const row = await findById("temporaryRecruitments", req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, message: "Temporary recruitment not found" });
  }

  const context = await buildTemporaryRecruitmentContext();
  const serialized = serializeTemporaryRecruitment(row, context);
  return ok(res, serialized);
}

export async function createTemporaryRecruitment(req, res) {
  const createdRow = await insert("temporaryRecruitments", {
    ...req.body,
    available: req.body?.available ?? true,
  });
  const context = await buildTemporaryRecruitmentContext();
  const serialized = serializeTemporaryRecruitment(createdRow, context);
  return created(res, serialized, "Temporary recruitment created");
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

  const context = await buildTemporaryRecruitmentContext();
  const serialized = serializeTemporaryRecruitment(updated, context);
  return ok(res, serialized, "Temporary recruitment updated");
}
