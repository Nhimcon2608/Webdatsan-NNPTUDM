// Chuẩn hóa dữ liệu partnership request và owner thành contract ổn định cho frontend.
function slugify(value) {
  return String(value || "owner")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");
}

export function normalizePartnershipRequestStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();

  switch (normalized) {
    case "sent":
    case "pending":
    case "approved":
    case "refused":
      return normalized;
    case "submitted":
      return "sent";
    case "rejected":
    case "cancelled":
    case "canceled":
      return "refused";
    default:
      return normalized || "sent";
  }
}

function resolveOwnerName(owner) {
  return owner?.ownerName || owner?.fullName || "";
}

export function fallbackOwnerEmail(owner) {
  if (owner?.email) {
    return owner.email;
  }

  const ownerName = resolveOwnerName(owner) || "owner";
  return `${slugify(ownerName) || "owner"}@webdatsan.vn`;
}

export function extractOwnerFromRequest(request) {
  const nestedOwner = request?.owner || {};
  const ownerName =
    request?.ownerName || nestedOwner.ownerName || nestedOwner.fullName || "";
  const phoneNumber = request?.ownerPhoneNumber || nestedOwner.phoneNumber || "";
  const email = request?.ownerEmail || nestedOwner.email || fallbackOwnerEmail({ ownerName });

  return {
    id: request?.ownerId || nestedOwner.id || "",
    ownerName,
    fullName: ownerName,
    phoneNumber,
    email,
  };
}

export function doesRequestBelongToOwner(request, owner) {
  const ownerName = resolveOwnerName(owner);
  const requestOwner = extractOwnerFromRequest(request);

  return Boolean(
    (requestOwner.id && owner?.id === requestOwner.id) ||
      (requestOwner.phoneNumber && owner?.phoneNumber === requestOwner.phoneNumber) ||
      (requestOwner.email &&
        (owner?.email === requestOwner.email || owner?.ownerEmail === requestOwner.email)) ||
      (requestOwner.ownerName && ownerName === requestOwner.ownerName),
  );
}

export function mergeOwnersWithRequests(owners = [], requests = []) {
  const mergedOwners = [...owners];

  requests.forEach((request) => {
    const inferredOwner = extractOwnerFromRequest(request);
    if (!inferredOwner.ownerName && !inferredOwner.phoneNumber && !inferredOwner.email) {
      return;
    }

    if (mergedOwners.some((owner) => doesRequestBelongToOwner(request, owner))) {
      return;
    }

    mergedOwners.push({
      ...inferredOwner,
      id: inferredOwner.id || `request-owner-${request?.id || Date.now()}`,
    });
  });

  return mergedOwners;
}

export function serializePartnershipRequest(request, options = {}) {
  const { branch = null, owner = null } = options;
  const nestedOwner = request?.owner || {};
  const nestedPartner = request?.partner || {};

  return {
    ...request,
    branchId: request?.branchId || branch?.id || "",
    branchName: request?.branchName || nestedPartner.branchName || branch?.branchName || branch?.name || "",
    address: request?.address || nestedPartner.address || branch?.address || "",
    phoneNumber:
      request?.phoneNumber ||
      nestedPartner.phoneNumber ||
      request?.ownerPhoneNumber ||
      nestedOwner.phoneNumber ||
      owner?.phoneNumber ||
      "",
    ownerId: request?.ownerId || nestedOwner.id || owner?.id || "",
    ownerName:
      request?.ownerName ||
      nestedOwner.ownerName ||
      nestedOwner.fullName ||
      owner?.ownerName ||
      owner?.fullName ||
      "",
    email: request?.ownerEmail || nestedOwner.email || fallbackOwnerEmail(owner || nestedOwner),
    createAt: request?.createAt || request?.createdAt || "",
    status: normalizePartnershipRequestStatus(request?.status),
  };
}

export function serializeOwner(owner, requests, branches) {
  const ownerName = resolveOwnerName(owner);
  const normalizedOwner = {
    ...owner,
    ownerName,
    email: owner?.email || owner?.ownerEmail || fallbackOwnerEmail(owner),
  };

  const partnershipRequest = requests
    .filter((request) => doesRequestBelongToOwner(request, normalizedOwner))
    .map((request) => {
      const branch = branches.find(
        (branchItem) =>
          branchItem.id === request?.branchId ||
          branchItem.partnershipRequestId === request?.id,
      );
      return serializePartnershipRequest(request, { branch, owner: normalizedOwner });
    })
    .sort((left, right) => new Date(right.createAt).getTime() - new Date(left.createAt).getTime());

  return {
    ...normalizedOwner,
    partnershipRequest,
  };
}
