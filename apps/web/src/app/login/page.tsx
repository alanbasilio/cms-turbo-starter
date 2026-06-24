"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/src/components/auth/auth-card";
import { TextField } from "@/src/components/auth/text-field";
import { useRedirectIfAuthenticated } from "@/src/components/auth/use-redirect-if-authenticated";
import { useAuth } from "@/src/components/auth-provider";
import { usePostAuthLocal } from "@/src/generated/hooks/usePostAuthLocal";
import { getApiErrorMessage } from "@/src/lib/api-client";
import { type LoginValues, loginSchema } from "@/src/lib/auth-schemas";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const mutation = usePostAuthLocal();

  const onSubmit = handleSubmit((values) => {
    setError(null);
    mutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          if (data.jwt) {
            login(data.jwt);
            router.replace("/");
          } else {
            setError("Resposta inválida do servidor.");
          }
        },
        onError: (err) => setError(getApiErrorMessage(err)),
      },
    );
  });

  return (
    <AuthCard
      title="Entrar"
      description="Acesse sua conta para continuar."
      onSubmit={onSubmit}
      error={error}
      isPending={mutation.isPending}
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
