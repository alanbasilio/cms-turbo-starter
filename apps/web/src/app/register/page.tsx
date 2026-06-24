"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/src/components/auth/auth-card";
import { TextField } from "@/src/components/auth/text-field";
import { useRedirectIfAuthenticated } from "@/src/components/auth/use-redirect-if-authenticated";
import { useAuth } from "@/src/components/auth-provider";
import { usePostAuthLocalRegister } from "@/src/generated/hooks/usePostAuthLocalRegister";
import { getApiErrorMessage } from "@/src/lib/api-client";
import { type RegisterValues, registerSchema } from "@/src/lib/auth-schemas";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const mutation = usePostAuthLocalRegister();

  const onSubmit = handleSubmit(({ username, email, password }) => {
    setError(null);
    mutation.mutate(
      { data: { username, email, password } },
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
      title="Criar conta"
      description="Preencha os dados para começar."
      onSubmit={onSubmit}
      error={error}
      isPending={mutation.isPending}
      submitLabel="Criar conta"
      pendingLabel="Criando conta..."
      footerPrompt="Já tem conta?"
      footerHref="/login"
      footerLinkLabel="Entrar"
    >
      <TextField
        id="username"
        label="Usuário"
        autoComplete="username"
        error={errors.username?.message}
        {...register("username")}
      />
      <TextField
        id="email"
        label="E-mail"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        id="password"
        label="Senha"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <TextField
        id="confirmPassword"
        label="Confirmar senha"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
    </AuthCard>
  );
}
