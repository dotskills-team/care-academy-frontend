// Mirrors the server's response envelope (care-consultancy-server: utils/sendResponse.ts and
// middlewares/globalErrorHandler.ts).

export interface ApiMeta {
  total: number;
  [key: string]: unknown;
}

export interface ApiEnvelope<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
}

/** Field-level problems from Zod/Mongoose validation: `path` is the field name. */
export interface ErrorSource {
  path: string | number;
  message: string;
}

export class ApiError extends Error {
  /** HTTP status, or 0 when the server could not be reached. */
  readonly status: number;
  readonly errorSources: ErrorSource[];

  constructor(status: number, message: string, errorSources: ErrorSource[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorSources = errorSources;
  }

  /** First validation message for a field, if the server sent one. */
  fieldMessage(field: string): string | undefined {
    return this.errorSources.find((e) => String(e.path) === field)?.message;
  }
}
