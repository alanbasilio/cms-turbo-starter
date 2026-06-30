import Link from "next/link";
import type * as React from "react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

type AuthCardProps = {
  title: string;
  description: string;
  /** Pass `form.handleSubmit(onSubmit)` from react-hook-form. */
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  /** Server/submit-level error message (field errors live on the fields). */
  error?: string | null;
  isPending: boolean;
  submitLabel: string;
  pendingLabel: string;
  submitDisabled?: boolean;
  footerPrompt: string;
  footerHref: string;
  footerLinkLabel: string;
  children: React.ReactNode;
};

/** Shared chrome for the login and register forms. */
export function AuthCard({
  title,
  description,
  onSubmit,
  error,
  isPending,
  submitLabel,
  pendingLabel,
  submitDisabled,
  footerPrompt,
  footerHref,
  footerLinkLabel,
  children,
}: AuthCardProps) {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit} noValidate>
          <CardContent className="flex flex-col gap-4">
            {children}
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </CardContent>
          <CardFooter className="mt-6 flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || submitDisabled}
            >
              {isPending ? pendingLabel : submitLabel}
            </Button>
            <p className="text-sm text-muted-foreground">
              {footerPrompt}{" "}
              <Link href={footerHref} className="text-primary hover:underline">
                {footerLinkLabel}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
