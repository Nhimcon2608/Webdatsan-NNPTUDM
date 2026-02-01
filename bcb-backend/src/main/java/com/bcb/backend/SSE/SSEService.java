package com.bcb.backend.SSE;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class SSEService {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String userId) {
        SseEmitter emitter = new SseEmitter(0L);

        emitters.put(userId, emitter);

        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError(e -> emitters.remove(userId));

        return emitter;
    }

    public void broadcastToAll(String eventName, Object data) {
        emitters.forEach((userId, emitter) -> {
            try {
                emitter.send(
                    SseEmitter.event()
                        .name(eventName)
                        .data(data)
                );
            } catch (IOException e) {
                emitters.remove(userId);
            }
        });
    }

    public void sendToUser(String userId, String eventName, Object data) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter == null) return;

        try {
            emitter.send(
                SseEmitter.event()
                    .name(eventName)
                    .data(data)
            );
        } catch (IOException e) {
            emitters.remove(userId);
        }
    }
}
