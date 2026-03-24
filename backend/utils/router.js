import { Router as ExpressRouter } from "express";

import { asyncHandler } from "./asyncHandler.js";

const METHODS = ["all", "get", "post", "put", "patch", "delete", "options", "head", "use"];

function isRouterLike(value) {
  return typeof value === "function" && typeof value.handle === "function" && Array.isArray(value.stack);
}

function wrapHandler(handler) {
  if (typeof handler !== "function" || handler.length === 4 || isRouterLike(handler)) {
    return handler;
  }

  return asyncHandler(handler);
}

function wrapArgument(argument) {
  if (Array.isArray(argument)) {
    return argument.map(wrapArgument);
  }

  return wrapHandler(argument);
}

export function Router(...args) {
  const router = ExpressRouter(...args);

  for (const method of METHODS) {
    const original = router[method].bind(router);
    router[method] = (...routeArgs) => original(...routeArgs.map(wrapArgument));
  }

  return router;
}
