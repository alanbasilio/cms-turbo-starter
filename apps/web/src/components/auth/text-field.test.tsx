import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextField } from "./text-field";

describe("TextField", () => {
  it("renders the label and ties it to the input", () => {
    render(<TextField id="email" label="E-mail" />);
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
  });

  it("shows the error message and marks the input invalid", () => {
    render(<TextField id="email" label="E-mail" error="E-mail inválido." />);
    expect(screen.getByText("E-mail inválido.")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("is valid when no error is provided", () => {
    render(<TextField id="username" label="Usuário" />);
    expect(screen.getByLabelText("Usuário")).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });
});
