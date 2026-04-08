// Dữ liệu seed mặc định sẽ được thêm nếu id tương ứng chưa tồn tại trong MongoDB.
function nowIso() {
  return new Date().toISOString();
}

export const defaults = {
  // Các tài khoản nền cho ba vai trò chính trong luồng local/demo.
  accounts: [
    {
      id: "acc-admin-1",
      email: "admin@webdatsan.vn",
      password: "123456",
      fullName: "Admin",
      phoneNumber: "0900000000",
      role: "ADMIN",
      avatarUrl: "",
      createdAt: nowIso(),
    },
    {
      id: "acc-1",
      email: "manager@webdatsan.vn",
      password: "123456",
      fullName: "Manager",
      phoneNumber: "0900000001",
      role: "MANAGER",
      avatarUrl: "",
      createdAt: nowIso(),
    },
    {
      id: "acc-2",
      email: "player@webdatsan.vn",
      password: "123456",
      fullName: "Player",
      phoneNumber: "0900000002",
      role: "USER",
      avatarUrl: "",
      createdAt: nowIso(),
    },
  ],
  // Chủ sân dùng để làm giàu dữ liệu branch và partnership request.
  owners: [
    { id: "owner-1", fullName: "Owner A", phoneNumber: "0900000011", createdAt: nowIso() },
  ],
  // Hồ sơ người chơi được lưu tách khỏi tài khoản đăng nhập.
  players: [
    {
      id: "player-1",
      accountId: "acc-2",
      nickName: "Nguyen Van A",
      level: "INTERMEDIATE",
      createdAt: nowIso(),
    },
  ],
  // Branch là tài nguyên nghiệp vụ chính do admin và manager quản lý.
  branches: [
    {
      id: "branch-1",
      ownerId: "owner-1",
      managerAccountId: "acc-1",
      partnershipRequestId: "pr-1",
      name: "BCB District 1",
      address: "Quan 1, TP.HCM",
      isCooperated: true,
      status: "ACTIVE",
      createdAt: nowIso(),
    },
  ],
  // Partnership request nối nhu cầu hợp tác của chủ sân với dữ liệu branch.
  partnershipRequests: [
    {
      id: "pr-1",
      branchId: "branch-1",
      ownerName: "Owner A",
      status: "PENDING",
      createdAt: nowIso(),
    },
  ],
  // Court thuộc về một branch và là đơn vị được người dùng đặt thực tế.
  badmintonCourts: [
    {
      id: "court-1",
      branchId: "branch-1",
      managerAccountId: "acc-1",
      name: "San 1",
      status: "ACTIVE",
      images: [],
      createdAt: nowIso(),
    },
  ],
  // Price type định nghĩa các nhóm giá dùng lại như thường hoặc VIP.
  priceTypes: [
    { id: "pt-1", name: "Thuong", createdAt: nowIso() },
    { id: "pt-2", name: "VIP", createdAt: nowIso() },
  ],
  // Price là dữ liệu theo branch, thường gắn với loại giá và khung giờ.
  prices: [
    {
      id: "price-1",
      branchId: "branch-1",
      priceTypeId: "pt-1",
      startTime: "06:00",
      endTime: "17:00",
      amount: 100000,
      createdAt: nowIso(),
    },
  ],
  // Reservation lưu bản ghi đặt sân ở mức tổng.
  reservations: [
    {
      id: "res-1",
      userAccountId: "acc-2",
      branchId: "branch-1",
      courtId: "court-1",
      bookDate: nowIso().slice(0, 10),
      status: "BOOKED",
      createdAt: nowIso(),
    },
  ],
  // Reservation detail lưu slot cụ thể cho từng reservation.
  reservationDetails: [
    {
      id: "rd-1",
      reservationId: "res-1",
      courtId: "court-1",
      slotDate: nowIso().slice(0, 10),
      slotStart: "18:00",
      slotEnd: "19:00",
      createdAt: nowIso(),
    },
  ],
  // Reservation slot lock giữ chỗ theo từng khung giờ nhỏ để chặn double booking đồng thời.
  reservationSlotLocks: [],
  // Fixed booking được sinh theo nhu cầu nên seed mặc định để trống.
  fixedBookings: [],
  // Review lưu phản hồi của người dùng cho branch.
  reviews: [
    {
      id: "review-1",
      branchId: "branch-1",
      accountId: "acc-2",
      rating: 5,
      content: "San tot",
      createdAt: nowIso(),
    },
  ],
  // Payment theo dõi hóa đơn và trạng thái thanh toán của reservation.
  payments: [
    {
      id: "pay-1",
      reservationId: "res-1",
      branchId: "branch-1",
      paymentStatus: "PENDING",
      amount: 100000,
      createdAt: nowIso(),
    },
  ],
  // Voucher là mã khuyến mãi ở mức branch.
  vouchers: [
    {
      id: "voucher-1",
      branchId: "branch-1",
      code: "WELCOME10",
      discountPercent: 10,
      status: "ACTIVE",
      createdAt: nowIso(),
    },
  ],
  // Temporary recruitment là bài tuyển thêm người chơi cho một booking có sẵn.
  temporaryRecruitments: [
    {
      id: "tr-1",
      reservationId: "res-1",
      branchId: "branch-1",
      available: true,
      createdAt: nowIso(),
    },
  ],
  // Saved recruitment và registration là dữ liệu cá nhân hóa theo từng user.
  temporaryRecruitmentSaved: [],
  temporaryRegistrations: [],
};

export const resources = Object.freeze(Object.keys(defaults));
