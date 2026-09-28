"use client";

import { useActionState, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { loginAdmin } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/FormField";
import { adminLoginSchema, flattenAuthIssues } from "@/lib/validations/auth";

/**
 * Administrative sign-in form (docs/TASKS.md Task 6.1).
 *
 * Follows the same gate pattern as `ContactForm`: client-side validation
 * with the shared schema blocks invalid submits with inline errors; valid
 * submits dispatch the `loginAdmin` server action, whose returned state
 * (field errors / message) renders inline under `role="alert"`.
 * Success never renders here — the action redirects to /admin.
 */
export function AdminLoginForm() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [state, formAction, pending] = useActionState(loginAdmin, {
    status: "idle",
    message: null,
    fieldErrors: null,
  });

  // Server-returned field errors (from the last action) merged with
  // locally validated ones; editing a field clears its local error.
  // Derived during render — no effect needed.
  const fieldErrors = {
    ...(state.status === "error" ? (state.fieldErrors ?? {}) : {}),
    ...clientErrors,
  };

  function update(key: "email" | "password", value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setClientErrors((previous) => {
      if (!(key in previous)) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    // Same schema the server enforces — single source of truth.
    const parsed = adminLoginSchema.safeParse({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    if (!parsed.success) {
      event.preventDefault();
      const errors = flattenAuthIssues(parsed.error);
      setClientErrors(errors);
      const firstKey = Object.keys(errors)[0];
      if (firstKey) document.getElementById(`admin-${firstKey}`)?.focus();
      return;
    }

    // Valid — do NOT preventDefault: React dispatches the form's `action`
    // inside its own transition, which keeps `pending` accurate.
    setClientErrors({});
  }

  return (
    <form
      aria-labelledby="admin-login-title"
      noValidate
      onSubmit={handleSubmit}
      action={formAction}
      className="border-border bg-card w-full max-w-sm rounded-xl border p-8 shadow-sm"
    >
      <p className="text-eyebrow text-muted-foreground">Admin console</p>
      <h1
        id="admin-login-title"
        className="font-heading mt-2 text-xl font-semibold"
      >
        Administrator sign-in
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Restricted area — sessions expire automatically and every action is
        re-verified server-side.
      </p>

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/10 text-destructive mt-5 rounded-lg border p-3 text-sm"
        >
          {state.message}
        </div>
      ) : null}

      <div className="mt-6 space-y-5">
        <FormField
          id="admin-email"
          label="Email address"
          error={fieldErrors.email}
        >
          <Input
            id="admin-email"
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder="admin@example.com"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={
              fieldErrors.email ? "admin-email-error" : undefined
            }
          />
        </FormField>
        <FormField
          id="admin-password"
          label="Password"
          error={fieldErrors.password}
        >
          <Input
            id="admin-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={values.password}
            onChange={(event) => update("password", event.target.value)}
            aria-invalid={fieldErrors.password ? true : undefined}
            aria-describedby={
              fieldErrors.password ? "admin-password-error" : undefined
            }
          />
        </FormField>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          aria-busy={pending}
          className="h-11 w-full bg-[#15190D] text-white hover:bg-[#252B29] text-base"
        >
          {pending ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                className="size-4 motion-safe:animate-spin"
              />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <button
          type="button"
          onClick={() => {
            setValues({
              email: "admin@alderline-environmental.com",
              password: "AlderlineDemo2026!",
            });
            setClientErrors({});
          }}
          className="text-xs text-muted-foreground hover:text-foreground underline text-center mt-2 py-1"
        >
          Fill Demo Administrator Credentials
        </button>
      </div>

      <p className="text-muted-foreground/80 mt-6 text-xs leading-relaxed border-t border-border/50 pt-4">
        <span className="font-semibold text-foreground">Demonstration Mode:</span> Use the demo credentials above or your provisioned administrator account. Sessions expire automatically and every mutation is verified server-side.
      </p>
    </form>
  );
}
