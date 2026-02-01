package com.bcb.backend.SSE;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/sse")
@RequiredArgsConstructor
public class SSEController {

    private final SSEService sseService;

    @GetMapping("/subscribe/{userId}")
    public SseEmitter subscribe(@PathVariable String userId) {
        return sseService.subscribe(userId);
    }
}

