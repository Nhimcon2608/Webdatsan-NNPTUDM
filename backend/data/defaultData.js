function nowIso() {
  return new Date().toISOString();
}

export const defaults = {
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
  owners: [
    { id: "owner-1", fullName: "Owner A", phoneNumber: "0900000011", createdAt: nowIso() },
  ],
  players: [
    {
      id: "player-1",
      accountId: "acc-2",
      nickName: "Nguyen Van A",
      level: "INTERMEDIATE",
      createdAt: nowIso(),
    },
  ],
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
  partnershipRequests: [
    {
      id: "pr-1",
      branchId: "branch-1",
      ownerName: "Owner A",
      status: "PENDING",
      createdAt: nowIso(),
    },
  ],
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
  priceTypes: [
    { id: "pt-1", name: "Thuong", createdAt: nowIso() },
    { id: "pt-2", name: "VIP", createdAt: nowIso() },
  ],
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
  fixedBookings: [],
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
  temporaryRecruitments: [
    {
      id: "tr-1",
      reservationId: "res-1",
      branchId: "branch-1",
      available: true,
      createdAt: nowIso(),
    },
  ],
  temporaryRecruitmentSaved: [],
  temporaryRegistrations: [],
};

export const resources = Object.freeze(Object.keys(defaults));
