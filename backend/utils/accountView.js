// Loại bỏ field nhạy cảm và chuẩn hóa tên field account cho frontend.
export function toPublicAccount(account) {
  if (!account) {
    return null;
  }

  const { password, ...rest } = account;
  const displayName = rest.username || rest.fullName || rest.email || "";
  const imagePath = rest.imagePath || rest.avatarUrl || "";

  return {
    ...rest,
    username: displayName,
    imagePath,
    fullName: rest.fullName || displayName,
    avatarUrl: rest.avatarUrl || imagePath,
  };
}
