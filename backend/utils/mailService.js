import fs from "fs/promises";
import path from "path";

import nodemailer from "nodemailer";

import { getUploadsRoot } from "./uploadStorage.js";

function toBoolean(value) {
  return String(value || "")
    .trim()
    .toLowerCase() === "true";
}

function hasSmtpConfig() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  );
}

function getMailFrom() {
  return String(process.env.MAIL_FROM || "BcB <no-reply@webdatsan.local>").trim();
}

function sanitizeFilename(value, fallback = "mail") {
  const normalized = String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || fallback;
}

function buildResetPasswordEmail({ recipientName, newPassword }) {
  const safeRecipientName = recipientName || "ban";
  const subject = "BcB - Mat khau moi cho tai khoan cua ban";
  const text = [
    `Xin chao ${safeRecipientName},`,
    "",
    "Admin da dat lai mat khau cho tai khoan cua ban tren he thong BcB.",
    `Mat khau moi: ${newPassword}`,
    "",
    "Hay dang nhap lai va doi mat khau ngay sau khi vao he thong.",
  ].join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="margin-bottom: 16px;">BcB - Mat khau moi</h2>
      <p>Xin chao <strong>${safeRecipientName}</strong>,</p>
      <p>Admin da dat lai mat khau cho tai khoan cua ban tren he thong BcB.</p>
      <p>
        Mat khau moi:
        <strong style="font-size: 18px; letter-spacing: 1px;">${newPassword}</strong>
      </p>
      <p>Hay dang nhap lai va doi mat khau ngay sau khi vao he thong.</p>
    </div>
  `;

  return { subject, text, html };
}

async function persistPreviewMail({ to, subject, text, html }) {
  const mailboxDirectory = path.join(getUploadsRoot(), "mailbox");
  const filename = `${Date.now()}-${sanitizeFilename(to, "mail")}.html`;
  const absolutePath = path.join(mailboxDirectory, filename);
  const publicPath = `/uploads/mailbox/${filename}`;
  const document = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${subject}</title>
      </head>
      <body>
        <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">To: ${to}
Subject: ${subject}

${text}</pre>
        <hr />
        ${html}
      </body>
    </html>
  `;

  await fs.mkdir(mailboxDirectory, { recursive: true });
  await fs.writeFile(absolutePath, document, "utf8");

  return {
    method: "file",
    previewPath: absolutePath,
    previewUrl: publicPath,
  };
}

function createTransporter() {
  return nodemailer.createTransport({
    host: String(process.env.SMTP_HOST || "").trim(),
    port: Number(process.env.SMTP_PORT || 587),
    secure: toBoolean(process.env.MAIL_SECURE),
    auth: {
      user: String(process.env.SMTP_USER || "").trim(),
      pass: String(process.env.SMTP_PASS || "").trim(),
    },
  });
}

export async function sendResetPasswordEmail({ to, recipientName, newPassword }) {
  const emailPayload = buildResetPasswordEmail({ recipientName, newPassword });

  if (!hasSmtpConfig()) {
    return persistPreviewMail({
      to,
      ...emailPayload,
    });
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: getMailFrom(),
    to,
    ...emailPayload,
  });

  return {
    method: "smtp",
  };
}
