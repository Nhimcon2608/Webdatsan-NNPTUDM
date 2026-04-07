// Controller CRUD cho voucher của branch và cập nhật trạng thái mã khuyến mãi.
import { created, ok } from "../utils/response.js";
import { findById, insert, list, updateById } from "../utils/store.js";

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function readStartsAt(payload = {}) {
  if (hasOwn(payload, "startsAt")) {
    return payload.startsAt;
  }

  if (hasOwn(payload, "startAt")) {
    return payload.startAt;
  }

  if (hasOwn(payload, "startDate")) {
    return payload.startDate;
  }

  return undefined;
}

function readEndsAt(payload = {}) {
  if (hasOwn(payload, "endsAt")) {
    return payload.endsAt;
  }

  if (hasOwn(payload, "endAt")) {
    return payload.endAt;
  }

  if (hasOwn(payload, "endDate")) {
    return payload.endDate;
  }

  return undefined;
}

function normalizeDateTime(value, fieldName) {
  if (value == null || value === "") {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${fieldName} is invalid`);
  }

  return parsed.toISOString();
}

function normalizeAvailability(payload = {}) {
  const normalized = {};

  if (hasOwn(payload, "available")) {
    normalized.available = Boolean(payload.available);
  }

  if (hasOwn(payload, "status")) {
    if (typeof payload.status === "boolean") {
      normalized.available = payload.status;
      normalized.status = payload.status ? "ACTIVE" : "INACTIVE";
    } else {
      const status = String(payload.status || "").trim().toUpperCase();
      normalized.status = status || "INACTIVE";

      if (!hasOwn(payload, "available")) {
        normalized.available = status === "ACTIVE";
      }
    }
  }

  if (normalized.available !== undefined && !normalized.status) {
    normalized.status = normalized.available ? "ACTIVE" : "INACTIVE";
  }

  return normalized;
}

function normalizeVoucherPayload(payload = {}) {
  const normalized = {
    ...normalizeAvailability(payload),
  };

  if (hasOwn(payload, "event")) {
    normalized.event = String(payload.event || "").trim();
  }

  if (hasOwn(payload, "branchId")) {
    normalized.branchId = String(payload.branchId || "").trim();
  }

  if (hasOwn(payload, "discountRate") || hasOwn(payload, "discountPercent")) {
    normalized.discountRate = Number(payload.discountRate ?? payload.discountPercent);
  }

  const startsAt = readStartsAt(payload);
  if (startsAt !== undefined) {
    normalized.startsAt = normalizeDateTime(startsAt, "startsAt");
  }

  const endsAt = readEndsAt(payload);
  if (endsAt !== undefined) {
    normalized.endsAt = normalizeDateTime(endsAt, "endsAt");
  }

  return normalized;
}

function validateVoucherPayload(payload, { requireSchedule = false } = {}) {
  if (!payload.event) {
    return "event is required";
  }

  if (!payload.branchId) {
    return "branchId is required";
  }

  if (!Number.isFinite(payload.discountRate) || payload.discountRate < 1 || payload.discountRate > 100) {
    return "discountRate must be between 1 and 100";
  }

  if (requireSchedule) {
    if (!payload.startsAt) {
      return "startsAt is required";
    }

    if (!payload.endsAt) {
      return "endsAt is required";
    }
  }

  if (payload.startsAt && payload.endsAt) {
    const startTime = new Date(payload.startsAt).getTime();
    const endTime = new Date(payload.endsAt).getTime();

    if (startTime >= endTime) {
      return "endsAt must be after startsAt";
    }
  }

  return null;
}

function touchesVoucherDefinition(payload = {}) {
  return [
    "event",
    "branchId",
    "discountRate",
    "discountPercent",
    "startsAt",
    "startAt",
    "startDate",
    "endsAt",
    "endAt",
    "endDate",
  ].some((key) => hasOwn(payload, key));
}

export async function getVouchers(req, res) {
  const { branchId } = req.query;
  let rows = await list("vouchers");

  if (branchId) {
    rows = rows.filter((item) => item.branchId === branchId);
  }

  rows.sort((left, right) => {
    const leftTime =
      new Date(left.startsAt || left.createdAt || left.createAt || 0).getTime() || 0;
    const rightTime =
      new Date(right.startsAt || right.createdAt || right.createAt || 0).getTime() || 0;
    return rightTime - leftTime;
  });

  return ok(res, rows);
}

export async function createVoucher(req, res) {
  let payload;

  try {
    payload = normalizeVoucherPayload(req.body || {});
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  if (payload.available === undefined) {
    payload.available = true;
  }

  if (!payload.status) {
    payload.status = payload.available ? "ACTIVE" : "INACTIVE";
  }

  const validationError = validateVoucherPayload(payload, { requireSchedule: true });
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  const createdRow = await insert("vouchers", payload);
  return created(res, createdRow, "Voucher created");
}

export async function updateVoucher(req, res) {
  const { voucherId } = req.params;
  const existing = await findById("vouchers", voucherId);

  if (!existing) {
    return res.status(404).json({ success: false, message: "Voucher not found" });
  }

  let payload;

  try {
    payload = normalizeVoucherPayload(req.body || {});
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  if (touchesVoucherDefinition(req.body || {})) {
    const mergedPayload = {
      event: payload.event ?? existing.event ?? "",
      branchId: payload.branchId ?? existing.branchId ?? "",
      discountRate:
        payload.discountRate ??
        Number(existing.discountRate ?? existing.discountPercent ?? NaN),
      startsAt:
        payload.startsAt ??
        existing.startsAt ??
        existing.startAt ??
        existing.startDate ??
        "",
      endsAt:
        payload.endsAt ??
        existing.endsAt ??
        existing.endAt ??
        existing.endDate ??
        "",
    };

    const validationError = validateVoucherPayload(mergedPayload, { requireSchedule: true });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    payload = {
      ...payload,
      ...mergedPayload,
    };
  }

  if (payload.available !== undefined && !payload.status) {
    payload.status = payload.available ? "ACTIVE" : "INACTIVE";
  }

  if (payload.status && payload.available === undefined) {
    payload.available = payload.status === "ACTIVE";
  }

  const updated = await updateById("vouchers", voucherId, payload);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Voucher not found" });
  }

  return ok(res, updated, "Voucher updated");
}
