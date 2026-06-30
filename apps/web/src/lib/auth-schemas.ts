import { z } from "zod";

// The Strapi-generated request schemas mark every field optional, so they can't
// drive real form validation. These app-owned schemas enforce the actual rules;
// their inferred types still line up with the generated mutation request types.

export const loginSchema = z.object({
  identifier: z.string().min(1, "Informe seu e-mail ou usuário."),
  password: z.string().min(1, "Informe sua senha."),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z.string().min(3, "Mínimo de 3 caracteres."),
    email: z.string().email("E-mail inválido."),
    password: z.string().min(6, "Mínimo de 6 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
