import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";

function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  return String(value).toLowerCase() === "true";
}

export function getAllTemporaryRecruitments(req, res) {
  const { branchId, available } = req.query;
  let rows = [...list("temporaryRecruitments")];

  if (branchId) {
    rows = rows.filter((item) => item.branchId === branchId);
  }

  if (available !== undefined) {
    rows = rows.filter((item) => item.available === toBoolean(available));
  }

  return ok(res, rows);
}

export function getTemporaryRecruitmentById(req, res) {
  const row = findById("temporaryRecruitments", req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, message: "Temporary recruitment not found" });
  }
  return ok(res, row);
}

export function getTemporaryRecruitmentFullInfor(req, res) {
  const row = findById("temporaryRecruitments", req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, message: "Temporary recruitment not found" });
  }

  return ok(res, {
    ...row,
    branch: list("branches").find((item) => item.id === row.branchId) || null,
    reservation: list("reservations").find((item) => item.id === row.reservationId) || null,
  });
}

export function getTemporaryRecruitmentByReservation(req, res) {
  const { id } = req.params;
  const row = list("temporaryRecruitments").find((item) => item.reservationId === id);
  if (!row) {
    return res.status(404).json({ success: false, message: "Temporary recruitment not found" });
  }
  return ok(res, row);
}

export function createTemporaryRecruitment(req, res) {
  const createdRow = insert("temporaryRecruitments", {
    ...req.body,
    available: req.body?.available ?? true,
  });

  return created(res, createdRow, "Temporary recruitment created");
}

export function changeTemporaryRecruitmentStatus(req, res) {
  const { id } = req.params;
  const available = req.body?.available;

  const updated = updateById("temporaryRecruitments", id, {
    available: available === undefined ? true : toBoolean(available),
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: "Temporary recruitment not found" });
  }

  return ok(res, updated, "Temporary recruitment status updated");
}

export function updateTemporaryRecruitment(req, res) {
  const { id } = req.params;
  const updated = updateById("temporaryRecruitments", id, req.body || {});

  if (!updated) {
    return res.status(404).json({ success: false, message: "Temporary recruitment not found" });
  }

  return ok(res, updated, "Temporary recruitment updated");
}
