import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";

function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  return String(value).toLowerCase() === "true";
}

export async function getAllTemporaryRecruitments(req, res) {
  const { branchId, available } = req.query;
  let rows = [...(await list("temporaryRecruitments"))];

  if (branchId) {
    rows = rows.filter((item) => item.branchId === branchId);
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
  return ok(res, row);
}

export async function getTemporaryRecruitmentFullInfor(req, res) {
  const row = await findById("temporaryRecruitments", req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, message: "Temporary recruitment not found" });
  }

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

export async function getTemporaryRecruitmentByReservation(req, res) {
  const { id } = req.params;
  const row = (await list("temporaryRecruitments")).find((item) => item.reservationId === id);
  if (!row) {
    return res.status(404).json({ success: false, message: "Temporary recruitment not found" });
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

export async function changeTemporaryRecruitmentStatus(req, res) {
  const { id } = req.params;
  const available = req.body?.available;

  const updated = await updateById("temporaryRecruitments", id, {
    available: available === undefined ? true : toBoolean(available),
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: "Temporary recruitment not found" });
  }

  return ok(res, updated, "Temporary recruitment status updated");
}

export async function updateTemporaryRecruitment(req, res) {
  const { id } = req.params;
  const updated = await updateById("temporaryRecruitments", id, req.body || {});

  if (!updated) {
    return res.status(404).json({ success: false, message: "Temporary recruitment not found" });
  }

  return ok(res, updated, "Temporary recruitment updated");
}
