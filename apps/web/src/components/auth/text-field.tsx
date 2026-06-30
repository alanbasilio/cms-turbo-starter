import type * as React from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

type TextFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  /** Validation message to display below the field, if any. */
  error?: string;
};

/** Label + input + inline error, wired for react-hook-form's `register` spread. */
export function TextField({ label, error, id, ...props }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={Boolean(error)} {...props} />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
