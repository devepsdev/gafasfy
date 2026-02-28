import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../HomePage";

const mockT = {
  subtitle: "¡Ayuda a estas gafas a recorrer el mundo!",
  description: "¿Has encontrado estas gafas? ¡Genial!",
  instructions: [
    "Llévate las gafas a cualquier lugar",
    "Haz una foto con las gafas",
    "Comparte tu aventura",
    "Déjalas para el siguiente aventurero",
  ],
  takePhoto: "Hacer Foto",
  recentAdventures: "Aventuras Recientes",
  anonymous: "Aventurero Anónimo",
  unknownLocation: "Ubicación desconocida",
};

const fotasDePrueba = [
  { id: 1, url: "foto1.jpg", name: "Usuario 1", comment: "Comentario 1", lat: 40.0, len: -3.0 },
  { id: 2, url: "foto2.jpg", name: "Usuario 2", comment: "Comentario 2", lat: 41.0, len: 2.0 },
];

describe("HomePage", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  // ── Estado de carga ────────────────────────────────────────────────────────

  it("debe mostrar el título principal de la página al renderizar", async () => {
    // Arrange — fetch que resuelve inmediatamente con lista vacía
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    // Act
    render(<HomePage onNavigate={vi.fn()} t={mockT} />);

    // Assert
    expect(
      screen.getByText("Gafas Viajeras del Mundo")
    ).toBeInTheDocument();
  });

  it("debe mostrar el subtítulo con el texto de traducción recibido por props", async () => {
    // Arrange
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    // Act
    render(<HomePage onNavigate={vi.fn()} t={mockT} />);

    // Assert
    expect(
      screen.getByText("¡Ayuda a estas gafas a recorrer el mundo!")
    ).toBeInTheDocument();
  });

  it("debe mostrar las 4 instrucciones numeradas en la sección descriptiva", async () => {
    // Arrange
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    // Act
    render(<HomePage onNavigate={vi.fn()} t={mockT} />);

    // Assert
    expect(screen.getByText("Llévate las gafas a cualquier lugar")).toBeInTheDocument();
    expect(screen.getByText("Haz una foto con las gafas")).toBeInTheDocument();
    expect(screen.getByText("Comparte tu aventura")).toBeInTheDocument();
    expect(screen.getByText("Déjalas para el siguiente aventurero")).toBeInTheDocument();
  });

  it("debe mostrar el botón de hacer foto que navega a la página de subida", async () => {
    // Arrange
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    // Act
    render(<HomePage onNavigate={vi.fn()} t={mockT} />);

    // Assert — hay múltiples botones con ese texto; al menos uno debe existir
    const botones = screen.getAllByText("Hacer Foto");
    expect(botones.length).toBeGreaterThan(0);
  });

  // ── Llamada a la API ───────────────────────────────────────────────────────

  it("debe llamar a la API de fotos al montarse el componente", async () => {
    // Arrange
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    // Act
    render(<HomePage onNavigate={vi.fn()} t={mockT} />);

    // Assert
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("photos")
      );
    });
  });

  it("debe mostrar las fotos recientes cuando la API devuelve resultados", async () => {
    // Arrange
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fotasDePrueba),
      })
    );

    // Act
    render(<HomePage onNavigate={vi.fn()} t={mockT} />);

    // Assert — los nombres de usuario deben aparecer en las tarjetas
    await waitFor(() => {
      expect(screen.getByText("Usuario 1")).toBeInTheDocument();
      expect(screen.getByText("Usuario 2")).toBeInTheDocument();
    });
  });

  it("debe mostrar el mensaje de sé el primero cuando la API devuelve lista vacía", async () => {
    // Arrange
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    // Act
    render(<HomePage onNavigate={vi.fn()} t={mockT} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("¡Sé el primero!")).toBeInTheDocument();
    });
  });

  it("debe mostrar el encabezado de aventuras recientes", async () => {
    // Arrange
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    // Act
    render(<HomePage onNavigate={vi.fn()} t={mockT} />);

    // Assert
    expect(screen.getByText("Aventuras Recientes")).toBeInTheDocument();
  });

  // ── Navegación ─────────────────────────────────────────────────────────────

  it("debe llamar a onNavigate con upload al hacer clic en el botón de hacer foto", async () => {
    // Arrange
    const onNavigateMock = vi.fn();
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    render(<HomePage onNavigate={onNavigateMock} t={mockT} />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Act — clic en el botón principal dentro del artículo de descripción
    const boton = screen.getAllByRole("button", { name: /Hacer Foto/i })[0];
    await userEvent.click(boton);

    // Assert
    expect(onNavigateMock).toHaveBeenCalledWith("upload");
  });

  // ── Manejo de errores de red ───────────────────────────────────────────────

  it("debe mostrar lista vacía sin lanzar excepción cuando la API falla con error de red", async () => {
    // Arrange
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

    // Act
    render(<HomePage onNavigate={vi.fn()} t={mockT} />);

    // Assert — el componente no debe explotar; muestra mensaje vacío
    await waitFor(() => {
      expect(screen.getByText("¡Sé el primero!")).toBeInTheDocument();
    });
  });
});
