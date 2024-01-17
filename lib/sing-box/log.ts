export interface Log {
  disabled?: boolean;
  level?: "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "panic";
  output?: string;
  timestamp?: boolean;
}

export function template(): Log {
  return {
    level: "info",
  };
}
