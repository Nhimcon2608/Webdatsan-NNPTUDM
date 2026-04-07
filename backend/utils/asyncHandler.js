// Helper nhỏ để async handler đẩy lỗi về middleware lỗi của Express.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
