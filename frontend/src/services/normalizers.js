function hasOwn(object, key) {
	return Object.prototype.hasOwnProperty.call(object, key);
}

export function unwrapApiData(responseOrPayload) {
	if (responseOrPayload == null) {
		return responseOrPayload;
	}

	const payload =
		responseOrPayload &&
		typeof responseOrPayload === "object" &&
		hasOwn(responseOrPayload, "data")
			? responseOrPayload.data
			: responseOrPayload;

	if (
		payload &&
		typeof payload === "object" &&
		hasOwn(payload, "success") &&
		hasOwn(payload, "data")
	) {
		return payload.data;
	}

	return payload;
}

export function toArray(value) {
	return Array.isArray(value) ? value : [];
}

export function toFiniteNumber(value, fallback = 0) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

export function toHourNumber(value) {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) {
			return 0;
		}

		if (trimmed.includes(":")) {
			const [hours = "0", minutes = "0"] = trimmed.split(":");
			const parsedHours = Number(hours);
			const parsedMinutes = Number(minutes);
			if (Number.isFinite(parsedHours) && Number.isFinite(parsedMinutes)) {
				return parsedHours + parsedMinutes / 60;
			}
		}

		const parsed = Number(trimmed);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}

	return 0;
}

export function toTimeString(value) {
	if (typeof value === "string" && value.includes(":")) {
		const [hours = "00", minutes = "00", seconds] = value.split(":");
		const normalizedHours = String(hours).padStart(2, "0");
		const normalizedMinutes = String(minutes).padStart(2, "0");
		return seconds != null
			? `${normalizedHours}:${normalizedMinutes}:${String(seconds).padStart(2, "0")}`
			: `${normalizedHours}:${normalizedMinutes}`;
	}

	const hourValue = toHourNumber(value);
	const hours = Math.floor(hourValue);
	const minutes = Math.round((hourValue - hours) * 60);
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function computeDurationHours(startTime, endTime) {
	const start = toHourNumber(startTime);
	const end = toHourNumber(endTime);
	return Math.max(end - start, 0.5);
}

export function normalizeAccount(account) {
	if (!account) {
		return null;
	}

	const username = account.username || account.fullName || account.email || "";
	const imagePath = account.imagePath || account.avatarUrl || "";

	return {
		...account,
		username,
		fullName: account.fullName || username,
		imagePath,
		avatarUrl: account.avatarUrl || imagePath,
		activated: account.activated ?? true,
	};
}

export function normalizeBranch(branch) {
	if (!branch) {
		return null;
	}

	const cooperated = Boolean(branch.cooperated ?? branch.isCooperated ?? false);
	const branchName = branch.branchName || branch.name || "";
	const imagePath = branch.imagePath || branch.avatarUrl || "";

	return {
		...branch,
		branchName,
		name: branch.name || branchName,
		imagePath,
		cooperated,
		isCooperated: cooperated,
		email: branch.email || "",
		description: branch.description || "",
		bankName: branch.bankName || "",
		bankNumber: branch.bankNumber || "",
		phoneNumber: branch.phoneNumber || "",
		promoted: Boolean(branch.promoted),
	};
}

function inferOrdinalNumber(court, index = 0) {
	if (court?.ordinalNumber != null && court.ordinalNumber !== "") {
		const parsed = Number(court.ordinalNumber);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}

	const name = String(court?.name || "");
	const matched = name.match(/(\d+)/);
	if (matched) {
		return Number(matched[1]);
	}

	return index + 1;
}

function normalizeCourtImage(image, index = 0) {
	if (typeof image === "string") {
		return {
			id: `court-image-${index}`,
			imagePath: image,
			url: image,
		};
	}

	const imagePath = image?.imagePath || image?.url || image?.path || "";

	return {
		...image,
		id: image?.id || `court-image-${index}`,
		imagePath,
		url: image?.url || imagePath,
	};
}

export function normalizeCourt(court, index = 0) {
	if (!court) {
		return null;
	}

	const available =
		typeof court.available === "boolean"
			? court.available
			: String(court.status || "ACTIVE").toUpperCase() === "ACTIVE";
	const ordinalNumber = inferOrdinalNumber(court, index);
	const images = toArray(court.images).map(normalizeCourtImage);

	return {
		...court,
		name: court.name || `Sân ${ordinalNumber}`,
		ordinalNumber,
		available,
		status: available ? "ACTIVE" : "INACTIVE",
		images,
		imagePath: court.imagePath || images[0]?.imagePath || "",
	};
}

export function normalizeCourtList(courts) {
	return toArray(courts).map((court, index) => normalizeCourt(court, index));
}

function inferPriceTypeLabel(priceType, index = 0) {
	const rawValue = String(
		priceType?.type || priceType?.name || priceType?.label || "",
	).toLowerCase();

	if (
		rawValue.includes("co dinh") ||
		rawValue.includes("cố định") ||
		rawValue.includes("fixed")
	) {
		return "Cố định";
	}

	if (
		rawValue.includes("thuong") ||
		rawValue.includes("thường") ||
		rawValue.includes("standard") ||
		rawValue.includes("normal") ||
		rawValue.includes("vang lai") ||
		rawValue.includes("vãng lai") ||
		rawValue.includes("casual") ||
		rawValue.includes("walk")
	) {
		return "Vãng lai";
	}

	// Legacy backend chi co Thuong/VIP, trong UI dat theo ngay can bucket gia "thuong"
	// duoc uu tien cho nhom vãng lai. Bucket con lai duoc xem la cố định.
	if (rawValue.includes("vip")) {
		return "Cố định";
	}

	return index === 0 ? "Vãng lai" : "Cố định";
}

export function normalizePriceType(priceType, index = 0) {
	if (!priceType) {
		return null;
	}

	const type = inferPriceTypeLabel(priceType, index);

	return {
		...priceType,
		name: priceType.name || type,
		type,
	};
}

export function normalizePrice(price, priceType = null, index = 0) {
	if (!price) {
		return null;
	}

	const normalizedPriceType = normalizePriceType(priceType || price.priceType || {}, index);
	const dayOfWeek = String(price.dayOfWeek ?? price.dayofweek ?? "0");
	const pricePerHour = toFiniteNumber(
		price.pricePerHour ?? price.amount ?? price.price,
		0,
	);

	return {
		...price,
		startTime: toHourNumber(price.startTime),
		endTime: toHourNumber(price.endTime),
		pricePerHour,
		amount: toFiniteNumber(price.amount, pricePerHour),
		dayOfWeek,
		dayofweek: dayOfWeek,
		priceType: normalizedPriceType,
		priceTypeName: normalizedPriceType?.type || normalizedPriceType?.name || "",
	};
}

export function normalizePriceList(prices, priceType = null) {
	return toArray(prices).map((price, index) => normalizePrice(price, priceType, index));
}

export function groupPricesByType(priceData) {
	const unwrapped = unwrapApiData(priceData);
	const result = {
		fixedPrices: [],
		casualPrices: [],
	};

	if (Array.isArray(unwrapped)) {
		unwrapped.forEach((row, index) => {
			if (Array.isArray(row?.prices)) {
				const normalizedType = normalizePriceType(row, index);
				const targetKey =
					normalizedType.type === "Vãng lai" ? "casualPrices" : "fixedPrices";
				result[targetKey].push(...normalizePriceList(row.prices, normalizedType));
				return;
			}

			const normalizedPrice = normalizePrice(row, row?.priceType, index);
			const targetKey =
				normalizedPrice.priceType?.type === "Vãng lai"
					? "casualPrices"
					: "fixedPrices";
			result[targetKey].push(normalizedPrice);
		});
		return result;
	}

	if (unwrapped && typeof unwrapped === "object") {
		result.fixedPrices = normalizePriceList(unwrapped.fixedPrices);
		result.casualPrices = normalizePriceList(unwrapped.casualPrices);
	}

	return result;
}

export function normalizeReservationStatus(status) {
	const normalized = String(status || "").trim().toLowerCase();

	switch (normalized) {
		case "booked":
		case "pending":
		case "waiting":
			return "waiting";
		case "checked":
		case "checked_in":
		case "checkin":
			return "checked";
		case "finish":
		case "finished":
		case "completed":
		case "paid":
			return "finish";
		case "cancel":
		case "cancelled":
		case "canceled":
		case "scheduled_cancel":
			return "cancel";
		case "awaiting_payment":
			return "awaiting_payment";
		default:
			return normalized || "waiting";
	}
}

export function normalizeReservationDetail(detail, index = 0, reservation = {}) {
	if (!detail) {
		return null;
	}

	const startTime = toTimeString(detail.startTime || detail.slotStart || "00:00");
	const endTimeSource = detail.endTime || detail.slotEnd;
	const rentalTime =
		Number(detail.rentalTime) ||
		computeDurationHours(startTime, endTimeSource || detail.startTime || detail.slotStart);
	const playerName =
		detail.playerName || reservation.playerName || reservation.customerName || "Khách lẻ";

	return {
		...detail,
		id: detail.id || `${reservation.id || "reservation"}-detail-${index}`,
		badmintonCourtId:
			detail.badmintonCourtId || detail.courtId || detail.badmintonCourtID || "",
		courtId: detail.courtId || detail.badmintonCourtId || detail.badmintonCourtID || "",
		startTime,
		endTime: endTimeSource ? toTimeString(endTimeSource) : undefined,
		rentalTime,
		extendedTime: Number(detail.extendedTime || 0),
		playerName,
	};
}

export function normalizeReservation(reservation, index = 0) {
	if (!reservation) {
		return null;
	}

	const playerName =
		reservation.playerName ||
		reservation.customerName ||
		reservation.fullName ||
		"Khách lẻ";
	const reservationDetails = toArray(reservation.reservationDetails).map((detail, detailIndex) =>
		normalizeReservationDetail(detail, detailIndex, reservation),
	);
	const firstDetail = reservationDetails[0];
	const bookAt = reservation.bookAt || reservation.bookDate || reservation.createdAt || "";

	return {
		...reservation,
		playerName,
		status: normalizeReservationStatus(reservation.status),
		bookAt,
		bookDate: reservation.bookDate || String(bookAt).slice(0, 10),
		deposit: Number(reservation.deposit || 0),
		totalPrice: Number(reservation.totalPrice ?? reservation.amount ?? reservation.total ?? 0),
		reservationDetails,
		startTime: reservation.startTime || firstDetail?.startTime || "",
	};
}

export function normalizeReservationList(reservations) {
	return toArray(reservations).map((reservation, index) =>
		normalizeReservation(reservation, index),
	);
}

export function normalizeVoucher(voucher, index = 0) {
	if (!voucher) {
		return null;
	}

	const available =
		typeof voucher.available === "boolean"
			? voucher.available
			: String(voucher.status || "ACTIVE").toUpperCase() === "ACTIVE";
	const discountRate = toFiniteNumber(voucher.discountRate ?? voucher.discountPercent, 0);
	const startsAt = (() => {
		const rawValue = voucher.startsAt || voucher.startAt || voucher.startDate || "";
		const parsed = rawValue ? new Date(rawValue) : null;
		return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : "";
	})();
	const endsAt = (() => {
		const rawValue = voucher.endsAt || voucher.endAt || voucher.endDate || "";
		const parsed = rawValue ? new Date(rawValue) : null;
		return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : "";
	})();
	const createdAt = (() => {
		const rawValue = voucher.createdAt || voucher.createAt || "";
		const parsed = rawValue ? new Date(rawValue) : null;
		return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : "";
	})();
	const now = Date.now();
	const startTime = startsAt ? Date.parse(startsAt) : NaN;
	const endTime = endsAt ? Date.parse(endsAt) : NaN;
	const hasStarted = !Number.isFinite(startTime) || now >= startTime;
	const hasNotExpired = !Number.isFinite(endTime) || now <= endTime;
	const isRedeemableNow = available && hasStarted && hasNotExpired;
	let statusLabel = "Hoạt động";
	let statusColor = "success";

	if (!available) {
		statusLabel = "Đã khóa";
		statusColor = "default";
	} else if (Number.isFinite(startTime) && now < startTime) {
		statusLabel = "Sắp diễn ra";
		statusColor = "warning";
	} else if (Number.isFinite(endTime) && now > endTime) {
		statusLabel = "Hết hạn";
		statusColor = "error";
	}

	return {
		...voucher,
		event: voucher.event || voucher.code || `Voucher ${index + 1}`,
		discountRate,
		discountPercent: Number(voucher.discountPercent ?? discountRate),
		available,
		status: available ? "ACTIVE" : "INACTIVE",
		startsAt,
		endsAt,
		createdAt,
		createAt: createdAt,
		isRedeemableNow,
		statusLabel,
		statusColor,
	};
}

export function normalizeVoucherList(vouchers) {
	return toArray(vouchers).map((voucher, index) => normalizeVoucher(voucher, index));
}

export function normalizePayment(payment) {
	if (!payment) {
		return null;
	}

	return {
		...payment,
		createAt: payment.createAt || payment.createdAt || "",
		total: toFiniteNumber(payment.total ?? payment.amount, 0),
		paymentStatus: String(payment.paymentStatus || "PENDING").toUpperCase(),
	};
}

export function normalizePaymentList(payments) {
	return toArray(payments).map(normalizePayment);
}

export function normalizePartnershipRequest(request) {
	if (!request) {
		return null;
	}

	const status = String(request.status || "sent").trim().toLowerCase();

	return {
		...request,
		status,
		branchName: request.branchName || request.partner?.branchName || "",
		address: request.address || request.partner?.address || "",
		phoneNumber:
			request.phoneNumber ||
			request.partner?.phoneNumber ||
			request.ownerPhoneNumber ||
			request.owner?.phoneNumber ||
			"",
		ownerId: request.ownerId || request.owner?.id || "",
		ownerName:
			request.ownerName ||
			request.owner?.ownerName ||
			request.owner?.fullName ||
			"",
		email: request.email || request.ownerEmail || request.owner?.email || "",
		createAt: request.createAt || request.createdAt || "",
	};
}

export function normalizePartnershipRequestList(requests) {
	return toArray(requests).map(normalizePartnershipRequest);
}

export function normalizeOwner(owner) {
	if (!owner) {
		return null;
	}

	return {
		...owner,
		ownerName: owner.ownerName || owner.fullName || "",
		email: owner.email || owner.ownerEmail || "",
		partnershipRequest: normalizePartnershipRequestList(owner.partnershipRequest),
	};
}

export function normalizeOwnerList(owners) {
	return toArray(owners).map(normalizeOwner);
}
