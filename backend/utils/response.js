export function ok(res, data = null, message = "OK") {
  return res.status(200).json({ success: true, message, data });
}

export function created(res, data = null, message = "Created") {
  return res.status(201).json({ success: true, message, data });
}
