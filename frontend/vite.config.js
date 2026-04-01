import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

function resolveProxyTarget(env) {
    const explicitTarget = String(env.VITE_API_PROXY_TARGET || '').trim();
    if (explicitTarget) {
        return explicitTarget;
    }

    const apiBaseUrl = String(env.VITE_API_URL || '').trim();
    if (apiBaseUrl) {
        try {
            return new URL(apiBaseUrl).origin;
        } catch {
            return 'http://127.0.0.1:8080';
        }
    }

    return 'http://127.0.0.1:8080';
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            react(),
            tailwindcss(),
        ],
        server: {
            proxy: {
                '/api': {
                    target: resolveProxyTarget(env),
                    changeOrigin: true,
                },
            },
        },
    };
})
