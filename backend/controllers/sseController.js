export function subscribe(req, res) {
  const userId = req.query.userId || req.context.accountId;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  res.write(`event: CONNECTED\n`);
  res.write(`data: ${JSON.stringify({ userId, connectedAt: new Date().toISOString() })}\n\n`);

  const heartbeat = setInterval(() => {
    res.write(`event: PING\n`);
    res.write(`data: ${JSON.stringify({ ts: new Date().toISOString() })}\n\n`);
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    res.end();
  });
}
