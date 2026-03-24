function slugify(value) {
  return String(value || "owner")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");
}

function fallbackEmail(ownerName) {
  return `${slugify(ownerName) || "owner"}@webdatsan.vn`;
}

export function serializeBranch(branch, options = {}) {
  if (!branch) {
    return null;
  }

  const { owner = null, request = null } = options;
  const ownerName = owner?.ownerName || owner?.fullName || request?.ownerName || "";
  const cooperated = Boolean(branch.cooperated ?? branch.isCooperated ?? false);
  const branchName = branch.branchName || branch.name || request?.branchName || "";

  return {
    ...branch,
    branchName,
    name: branch.name || branchName,
    cooperated,
    isCooperated: cooperated,
    ownerName,
    email: branch.email || request?.ownerEmail || owner?.email || fallbackEmail(ownerName),
    phoneNumber: branch.phoneNumber || request?.phoneNumber || owner?.phoneNumber || "",
    imagePath: branch.imagePath || "",
    description: branch.description || "",
    status: branch.status || (cooperated ? "ACTIVE" : "INACTIVE"),
  };
}
