import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

function resolveApiProxyTarget(rawValue) {
    const fallback = 'http://127.0.0.1:8080'
    const normalizedValue = String(rawValue || '').trim()

    if (!normalizedValue) {
        return fallback
    }

    try {
        const url = new URL(normalizedValue)
        return url.origin
    } catch {
        return normalizedValue.replace(/\/api(?:\/.*)?$/, '') || fallback
    }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const apiProxyTarget = resolveApiProxyTarget(
        env.VITE_API_PROXY_TARGET || env.VITE_PROXY_TARGET || env.VITE_API_URL
    )

    return {
        plugins: [
            react(),
            tailwindcss(),
        ],
        server: {
            proxy: {
                '/api': {
                    target: apiProxyTarget,
                    changeOrigin: true,
                },
            },
        },
    }
})
