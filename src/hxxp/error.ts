import { type } from "arktype";
import type { StatusCode } from "hono/utils/http-status";

export const AppErrors = {
  Other: ["unknown", 500],
  Invalid: ["invalid-request", 400],
  Authn: ["authentication", 401],
  Authz: ["authorization", 403],
  NotExist: ["resource-not-found", 404],
  Exist: ["resource-already-exists", 409],
  Validation: ["validation", 422],
  Captcha: ["captcha", 422],
  RateLimiting: ["rate-limiting", 429],
  Database: ["database-query", 500],
  Service: ["internal-service-failure", 500],
} as const;

const schemaAppError = type({
  code: type.enumerated(...(Object.keys(AppErrors) as (keyof typeof AppErrors)[]).map((k) => AppErrors[k][0])),
  cause: "string",
});

export const schemaAppErrorJSON = type("string.json.parse").to(schemaAppError);

export class AppError extends Error {
  code: keyof typeof AppErrors;
  httpCode: StatusCode;
  constructor(code: keyof typeof AppErrors, message: string) {
    super(code, {
      cause: message,
    });
    this.code = code;
    const httpCode = AppErrors[code][1];
    if (!httpCode) {
      console.debug("app:error", code, message);
    }

    this.httpCode = httpCode || 500;
  }

  toString() {
    return `${this.code}: ${this.message}`;
  }
}
