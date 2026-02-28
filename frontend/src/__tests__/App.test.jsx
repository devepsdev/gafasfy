import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  beforeEach(() => {
    // La HomePage llama a fetch al montarse; se evita error de red
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );
  });

  // ── Renderizado inicial ────────────────────────────────────────────────────

  it("debe renderizar la HomePage por defecto al iniciar la aplicación", async () => {
    // Arrange & Act
    render(<App />);

    // Assert — el título principal de la home debe estar visible
    await waitFor(() => {
      expect(screen.getByText("Gafas Viajeras del Mundo")).toBeInTheDocument();
    });
  });

  it("debe mostrar el fondo con gradiente de la aplicación en el elemento raíz", () => {
    // Arrange & Act
    const { container } = render(<App />);

    // Assert
    expect(container.firstChild).toHaveClass("min-h-screen");
  });

  // ── Hook useLanguage ───────────────────────────────────────────────────────

  it("debe detectar el idioma español cuando el navegador reporta es-ES y mostrar textos en español", async () => {
    // Arrange — setup.js define navigator.language = 'es-ES'
    render(<App />);

    // Assert — el subtítulo en español debe aparecer
    await waitFor(() => {
      expect(
        screen.getByText("¡Ayuda a estas gafas a recorrer el mundo!")
      ).toBeInTheDocument();
    });
  });

  it("debe mostrar textos en inglés cuando el navegador reporta idioma en", async () => {
    // Arrange — simular navegador en inglés
    Object.defineProperty(navigator, "language", {
      get: () => "en-US",
      configurable: true,
    });

    render(<App />);

    // Assert — subtítulo en inglés
    await waitFor(() => {
      expect(
        screen.getByText("Help these glasses travel the world!")
      ).toBeInTheDocument();
    });

    // Restaurar español para tests posteriores
    Object.defineProperty(navigator, "language", {
      get: () => "es-ES",
      configurable: true,
    });
  });

  // ── Navegación entre páginas ───────────────────────────────────────────────

  it("debe navegar a UploadPage al hacer clic en el botón de hacer foto", async () => {
    // Arrange
    render(<App />);

    // Esperar a que cargue la HomePage
    await waitFor(() =>
      expect(screen.getAllByText("Hacer Foto").length).toBeGreaterThan(0)
    );

    // Act — clic en el primer botón de hacer foto
    fireEvent.click(screen.getAllByRole("button", { name: /Hacer Foto/i })[0]);

    // Assert — debe aparecer el título de la página de subida
    await waitFor(() => {
      expect(screen.getByText("Añadir Detalles")).toBeInTheDocument();
    });
  });

  it("debe navegar de vuelta a HomePage al hacer clic en volver al inicio desde UploadPage", async () => {
    // Arrange — navegar primero a UploadPage
    render(<App />);

    await waitFor(() =>
      expect(screen.getAllByText("Hacer Foto").length).toBeGreaterThan(0)
    );
    fireEvent.click(screen.getAllByRole("button", { name: /Hacer Foto/i })[0]);

    await waitFor(() =>
      expect(screen.getByText("Añadir Detalles")).toBeInTheDocument()
    );

    // Act — volver a home
    fireEvent.click(screen.getByRole("button", { name: /Volver al inicio/i }));

    // Assert — debe volver a mostrar la HomePage
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    expect(screen.getByText("Gafas Viajeras del Mundo")).toBeInTheDocument();
  });

  it("debe renderizar solo la página activa: HomePage no debe estar cuando se muestra UploadPage", async () => {
    // Arrange
    render(<App />);

    await waitFor(() =>
      expect(screen.getAllByText("Hacer Foto").length).toBeGreaterThan(0)
    );

    // Act — navegar a upload
    fireEvent.click(screen.getAllByRole("button", { name: /Hacer Foto/i })[0]);

    // Assert — el título de home no debe estar en la página de subida
    await waitFor(() => {
      expect(screen.queryByText("Aventuras Recientes")).not.toBeInTheDocument();
    });
  });
});
