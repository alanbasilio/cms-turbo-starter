"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/src/components/auth/auth-card";
import { TextField } from "@/src/components/auth/text-field";
import { useRedirectIfAuthenticated } from "@/src/components/auth/use-redirect-if-authenticated";
import { useAuth } from "@/src/components/auth-provider";
import { loginAction } from "@/src/lib/auth-actions";
import { type LoginValues, loginSchema } from "@/src/lib/auth-schemas";

export default function LoginPage() {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit((values) => {
    setError(null);
    startTransition(async () => {
      const result = await loginAction(values);
      if (result.ok) {
        await refreshSession();
        router.replace("/");
      } else {
        setError(result.error);
      }
    });
  });

  return (
    <AuthCard
      title="Entrar"
      description="Acesse sua conta para continuar."
      onSubmit={onSubmit}
      error={error}
      isPending={isPending}
      submitLabel="Entrar"
      pendingLabel="Entrando..."
      footerPrompt="Não tem conta?"
      footerHref="/register"
      footerLinkLabel="Criar conta"
    >
      <TextField
        id="identifier"
        label="E-mail ou usuário"
        autoComplete="username"
        error={errors.identifier?.message}
        {...register("identifier")}
      />
      <TextField
        id="password"
        label="Senha"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
    </AuthCard>
  );
}
