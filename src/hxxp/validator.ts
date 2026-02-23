import { type ArkErrors, type Type, type } from "arktype";
import type { Context, Env as HonoEnv, MiddlewareHandler, TypedResponse, ValidationTargets } from "hono";
import { AppError } from "./error";

export type Hook<T, E extends HonoEnv, P extends string, O = unknown> = (
  result: { success: false; data: unknown; errors: ArkErrors } | { success: true; data: T },
  c: Context<E, P>,
) => Response | Promise<Response> | undefined | Promise<Response | undefined> | TypedResponse<O>;

type HasUndefined<T> = undefined extends T ? true : false;

const RESTRICTED_DATA_FIELDS = {
  header: ["cookie"],
};

export const validate = <
  T extends Type,
  Target extends keyof ValidationTargets,
  E extends HonoEnv,
  P extends string,
  I = T["inferIn"],
  O = T["infer"],
  V extends {
    in: HasUndefined<I> extends true ? { [K in Target]?: I } : { [K in Target]: I };
    out: { [K in Target]: O };
  } = {
    in: HasUndefined<I> extends true ? { [K in Target]?: I } : { [K in Target]: I };
    out: { [K in Target]: O };
  },
>(
  target: Target,
  schema: T,
): MiddlewareHandler<E, P, V> =>
  // @ts-expect-error not typed well
  validator(target, (value) => {
    const out = schema(value);

    const hasErrors = out instanceof type.errors;

    if (hasErrors) {
      const errors =
        target in RESTRICTED_DATA_FIELDS
          ? out.map((error) => {
              const restrictedFields = RESTRICTED_DATA_FIELDS[target as keyof typeof RESTRICTED_DATA_FIELDS] || [];

              if (
                error &&
                typeof error === "object" &&
                "data" in error &&
                typeof error.data === "object" &&
                error.data !== null &&
                !Array.isArray(error.data)
              ) {
                const dataCopy = { ...(error.data as Record<string, unknown>) };
                for (const field of restrictedFields) {
                  delete dataCopy[field];
                }

                error.data = dataCopy;
              }

              return error;
            })
          : out;

      throw new AppError("Validation", errors.map((err) => err.toString()).join("\n"));
    }

    return out;
  });


export function validateOrThrow<T extends Type>(schema: T, value: unknown): T["infer"] {
  const out = schema(value);

  const hasErrors = out instanceof type.errors;
  if (!hasErrors) {
    return out;
  }

  throw new AppError("Validation", out.map((err) => err.toString()).join("\n"));
}