import { useCallback, useEffect, useRef } from "react";
import { apiBaseUrl } from "../src/services/api";
import { apiRoutes } from "../src/services/routes";

export default function useSSE(userId) {
    const sourceRef = useRef(null);
    const listenersRef = useRef([]);

    useEffect(() => {
        if (!userId) return;

        const token = localStorage.getItem("authToken");
        const params = new URLSearchParams({
            userId: String(userId),
        });

        if (token) {
            params.set("token", token);
        }

        const source = new EventSource(
            `${apiBaseUrl}${apiRoutes.notifications.stream}?${params.toString()}`
        );
        sourceRef.current = source;

        listenersRef.current.forEach(({ eventName, handler }) => {
            source.addEventListener(eventName, handler);
        });

        // console.log("SSE connected:", userId);

        source.onerror = () => {
            // console.log("SSE error, closing...");
            source.close();
        };

        return () => {
            // console.log("SSE cleanup - closed");
            source.close();
        };
    }, [userId]);

    const onEvent = useCallback((eventName, callback) => {
        const handler = (event) => {
            callback(JSON.parse(event.data));
        };

        listenersRef.current.push({ eventName, handler, callback });
        sourceRef.current?.addEventListener(eventName, handler);

        return () => {
            listenersRef.current = listenersRef.current.filter(
                (listener) => listener.handler !== handler
            );
            sourceRef.current?.removeEventListener(eventName, handler);
        };
    }, []);

    return { onEvent };
}
