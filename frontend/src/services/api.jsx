import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css"

const API_BASE_PATH = "/api";
const API_VERSION = "v1";

function buildApiBaseUrl(baseUrl) {
	const normalizedBase = String(baseUrl || "").trim();
	if (!normalizedBase) {
		return `${API_BASE_PATH}/${API_VERSION}`;
	}

	const ensureVersionedApiPath = (pathname) => {
		const trimmedPathname = String(pathname || "").replace(/\/+$/, "");
		const normalizedApiBase = API_BASE_PATH.replace(/\/+$/, "");
		const versionSuffix = `/${API_VERSION}`;

		if (!trimmedPathname) {
			return `${normalizedApiBase}${versionSuffix}`;
		}

		if (trimmedPathname.endsWith(`${normalizedApiBase}${versionSuffix}`)) {
			return trimmedPathname;
		}

		if (trimmedPathname.endsWith(normalizedApiBase)) {
			return `${trimmedPathname}${versionSuffix}`;
		}

		return `${trimmedPathname}${normalizedApiBase}${versionSuffix}`.replace(/\/+/g, "/");
	};

	try {
		const url = new URL(normalizedBase);
		url.pathname = ensureVersionedApiPath(url.pathname);
		return url.toString().replace(/\/$/, "");
	} catch {
		return ensureVersionedApiPath(normalizedBase);
	}
}

function buildBackendBaseUrl(baseUrl) {
	const normalizedBase = String(baseUrl || "").trim();
	if (!normalizedBase) {
		return "";
	}

	const stripApiSuffix = (value) =>
		String(value || "")
			.replace(new RegExp(`${API_BASE_PATH}/${API_VERSION}$`), "")
			.replace(new RegExp(`${API_BASE_PATH}$`), "")
			.replace(/\/+$/, "");

	try {
		const url = new URL(normalizedBase);
		url.pathname = stripApiSuffix(url.pathname);
		return url.toString().replace(/\/$/, "");
	} catch {
		return stripApiSuffix(normalizedBase);
	}
}

export function resolveBackendUrl(path) {
	const normalizedPath = String(path || "").trim();
	if (!normalizedPath) {
		return "";
	}

	if (/^https?:\/\//i.test(normalizedPath)) {
		return normalizedPath;
	}

	const sanitizedPath = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
	return backendBaseUrl ? `${backendBaseUrl}${sanitizedPath}` : sanitizedPath;
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
export const backendBaseUrl = buildBackendBaseUrl(apiBaseUrl);

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
