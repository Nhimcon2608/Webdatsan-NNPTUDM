import { created, ok } from "../utils/response.js";
import { insert, list } from "../utils/store.js";
import {
  buildTemporaryRecruitmentContext,
  serializeTemporaryRecruitment,
} from "../utils/temporaryRecruitmentView.js";

export async function getTemporaryRegistrations(req, res) {
  const accountId = req.context.accountId;
  const rows = (await list("temporaryRegistrations")).filter((item) => item.accountId === accountId);
  const context = await buildTemporaryRecruitmentContext();
  const data = rows
    .map((item) => {
      const recruitment = context.temporaryRecruitmentsById.get(item.temporaryRecruitmentId);
      if (!recruitment) {
        return null;
      }

      return {
        ...serializeTemporaryRecruitment(recruitment, context),
        registrationId: item.id,
        registrationStatus: item.status || "REGISTERED",
        registeredAt: item.createdAt || "",
      };
    })
    .filter(Boolean);

  return ok(res, data);
}

export async function registerTemporaryRecruitment(req, res) {
  const temporaryRecruitmentId = req.body?.temporaryRecruitmentId;
  if (!temporaryRecruitmentId) {
    return res.status(400).json({ success: false, message: "temporaryRecruitmentId is required" });
  }

  const createdRow = await insert("temporaryRegistrations", {
    accountId: req.context.accountId,
    temporaryRecruitmentId,
    status: "REGISTERED",
  });

  return created(res, createdRow, "Temporary recruitment registered");
}
