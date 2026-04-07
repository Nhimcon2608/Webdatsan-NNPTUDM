// Các schema zod dùng chung cho id, phân trang và trạng thái.
import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const statusSchema = z.object({
  status: z.string().min(1),
});
