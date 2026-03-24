import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css"

function buildApiBaseUrl(baseUrl) {
	const normalizedBase = String(baseUrl || "").trim();
	if (!normalizedBase) {
		return "/api";
	}

	try {
		const url = new URL(normalizedBase);
		const pathname = url.pathname.replace(/\/+$/, "");
		url.pathname = pathname.endsWith("/api")
			? pathname || "/api"
			: `${pathname}/api`.replace(/\/+/g, "/");
		return url.toString().replace(/\/$/, "");
	} catch {
		const base = normalizedBase.replace(/\/+$/, "");
		return base.endsWith("/api") ? base : `${base}/api`;
	}
}

let requestCount = 0;

function startProgress() {
	if (requestCount === 0) {
		NProgress.start();
	}
	requestCount++;
}

function stopProgress() {
	requestCount--;
	if (requestCount <= 0) {
		NProgress.done();
		requestCount = 0;
	}
}

export const apiBaseUrl = buildApiBaseUrl(import.meta.env.VITE_API_URL);

const apiClient = axios.create({
	baseURL: apiBaseUrl,
	// timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		// Headers (Authorization)
	},
});

apiClient.interceptors.request.use(
	(config) => {
		startProgress();

		const token = localStorage.getItem("authToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},

	(error) => {
		stopProgress();
		return Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	(response) => {
		stopProgress();
		return response;
	},
	(error) => {
		stopProgress();

		if (error.response) {
			switch (error.response.status) {

				case 400:
					break;

				case 401:
					break;

				case 404:
					break;
				
				case 403: 
					break;

				default:
					console.error("API Error:", error.response.data);
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
