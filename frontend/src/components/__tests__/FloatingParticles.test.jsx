import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FloatingParticles from "../FloatingParticles";

describe("FloatingParticles", () => {
  it("debe renderizar el componente sin errores", () => {
    // Arrange & Act
    const { container } = render(<FloatingParticles />);

    // Assert
    expect(container.firstChild).toBeInTheDocument();
  });

  it("debe renderizar exactamente 20 partículas flotantes", () => {
    // Arrange & Act
    const { container } = render(<FloatingParticles />);

    // Assert — cada partícula es un div hijo directo del contenedor
    const particulas = container.firstChild.children;
    expect(particulas).toHaveLength(20);
  });

  it("debe tener clase de overflow-hidden para evitar desbordamiento de partículas", () => {
    // Arrange & Act
    const { container } = render(<FloatingParticles />);

    // Assert
    expect(container.firstChild).toHaveClass("overflow-hidden");
  });

  it("debe aplicar pointer-events-none para no interceptar clics del usuario", () => {
    // Arrange & Act
    const { container } = render(<FloatingParticles />);

    // Assert
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
