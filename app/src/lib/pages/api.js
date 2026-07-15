import { decodeSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/sessionCore";

export const getAbsoluteRequestUrl = (req) => {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
  const proto = req.headers["x-forwarded-proto"] || (host.includes("localhost") ? "http" : "https");
  return new URL(req.url || "/", `${proto}://${host}`);
};

export const getRequestLike = (req) => ({
  url: getAbsoluteRequestUrl(req).toString(),
});

export const parseCookies = (cookieHeader = "") =>
  cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .reduce((cookies, cookie) => {
      const separator = cookie.indexOf("=");
      if (separator === -1) return cookies;
      const key = cookie.slice(0, separator).trim();
      const value = cookie.slice(separator + 1).trim();
      cookies[key] = decodeURIComponent(value);
      return cookies;
    }, {});

const serializeCookie = (name, value, options = {}) => {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);

  return parts.join("; ");
};

export const setResponseCookie = (res, name, value, options = {}) => {
  const nextCookie = serializeCookie(name, value, options);
  const current = res.getHeader("Set-Cookie");

  if (!current) {
    res.setHeader("Set-Cookie", nextCookie);
    return;
  }

  res.setHeader("Set-Cookie", Array.isArray(current) ? [...current, nextCookie] : [current, nextCookie]);
};

export const getSessionFromRequest = (req) => {
  const cookies = parseCookies(req.headers.cookie || "");
  return decodeSessionToken(cookies[SESSION_COOKIE_NAME]);
};

export const sendMethodNotAllowed = (res, methods = []) => {
  res.setHeader("Allow", methods);
  res.status(405).json({ error: "Method not allowed." });
};

export const readRequestBuffer = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

const parseContentDisposition = (value = "") =>
  value.split(";").reduce((parts, part) => {
    const [rawKey, rawValue] = part.trim().split("=");
    if (!rawKey || rawValue === undefined) return parts;
    parts[rawKey] = rawValue.replace(/^"|"$/g, "");
    return parts;
  }, {});

export const parseMultipartFormData = async (req) => {
  const contentType = req.headers["content-type"] || "";
  const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[1] || contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[2];

  if (!boundary) {
    throw new Error("Missing multipart boundary.");
  }

  const buffer = await readRequestBuffer(req);
  const delimiter = Buffer.from(`--${boundary}`);
  const fields = new Map();
  let offset = 0;

  while (offset < buffer.length) {
    const partStart = buffer.indexOf(delimiter, offset);
    if (partStart === -1) break;

    const contentStart = partStart + delimiter.length;
    if (buffer.slice(contentStart, contentStart + 2).toString() === "--") break;

    const headerStart = contentStart + 2;
    const headerEnd = buffer.indexOf(Buffer.from("\r\n\r\n"), headerStart);
    if (headerEnd === -1) break;

    const nextPart = buffer.indexOf(delimiter, headerEnd + 4);
    if (nextPart === -1) break;

    const headerText = buffer.slice(headerStart, headerEnd).toString("utf8");
    const headers = headerText.split("\r\n").reduce((parsed, line) => {
      const separator = line.indexOf(":");
      if (separator === -1) return parsed;
      parsed[line.slice(0, separator).trim().toLowerCase()] = line.slice(separator + 1).trim();
      return parsed;
    }, {});

    const disposition = parseContentDisposition(headers["content-disposition"]);
    const bodyEnd = buffer[nextPart - 2] === 13 && buffer[nextPart - 1] === 10 ? nextPart - 2 : nextPart;
    const body = buffer.slice(headerEnd + 4, bodyEnd);

    if (disposition.name) {
      fields.set(disposition.name, {
        name: disposition.name,
        filename: disposition.filename || "",
        type: headers["content-type"] || "",
        buffer: body,
        text: body.toString("utf8"),
      });
    }

    offset = nextPart;
  }

  return fields;
};
