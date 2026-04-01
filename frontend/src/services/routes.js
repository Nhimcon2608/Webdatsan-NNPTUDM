export const apiRoutes = {
	auth: {
		login: '/auth/login',
		register: '/auth/register',
		logout: '/auth/logout',
	},
	users: {
		root: '/users',
		me: '/users/me',
		password: '/users/me/password',
		avatar: '/users/me/avatar',
	},
	players: {
		me: '/players/me',
	},
	owners: {
		root: '/owners',
	},
	partnershipRequests: {
		root: '/partnership-requests',
		status: (requestId) => `/partnership-requests/${requestId}/status`,
	},
	branches: {
		root: '/branches',
		byId: (branchId) => `/branches/${branchId}`,
	},
	courts: {
		root: '/courts',
		byId: (courtId) => `/courts/${courtId}`,
		images: (courtId) => `/courts/${courtId}/images`,
		imageById: (courtId, imageId) => `/courts/${courtId}/images/${imageId}`,
	},
	prices: {
		root: '/prices',
		byId: (priceId) => `/prices/${priceId}`,
	},
	priceTypes: {
		root: '/price-types',
		byId: (priceTypeId) => `/price-types/${priceTypeId}`,
	},
	reservations: {
		root: '/reservations',
		byId: (reservationId) => `/reservations/${reservationId}`,
		notifications: (reservationId) => `/reservations/${reservationId}/notifications`,
		details: '/reservations/details',
		statusUpdates: '/reservations/status-updates',
		fixedBookings: '/reservations/fixed-bookings',
	},
	reviews: {
		root: '/reviews',
		byId: (reviewId) => `/reviews/${reviewId}`,
	},
	temporaryRecruitments: {
		root: '/temporary-recruitments',
		byId: (recruitmentId) => `/temporary-recruitments/${recruitmentId}`,
		saved: '/temporary-recruitments/saved',
		savedById: (recruitmentId) => `/temporary-recruitments/saved/${recruitmentId}`,
		registrations: '/temporary-recruitments/registrations',
	},
	payments: {
		root: '/payments',
		byId: (paymentId) => `/payments/${paymentId}`,
		links: '/payments/links',
	},
	vouchers: {
		root: '/vouchers',
		byId: (voucherId) => `/vouchers/${voucherId}`,
	},
};
