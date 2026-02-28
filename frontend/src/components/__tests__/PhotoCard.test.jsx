import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PhotoCard from "../PhotoCard";

// Traducciones mínimas necesarias para las pruebas
const mockT = {
  anonymous: "Aventurero Anónimo",
  unknownLocation: "Ubicación desconocida",
};

// Foto de ejemplo con todos los campos
const fotoCompleta = {
  id: 1,
  url: "foto_test.jpg",
  name: "María García",
  comment: "Las gafas en la Alhambra de Granada",
  lat: 37.1763,
  len: -3.5876,
};

// Foto sin campos opcionales
const fotoMinima = {
  id: 2,
  url: "foto_minima.jpg",
  name: null,
  comment: null,
  lat: 0,
  len: 0,
};

describe("PhotoCard", () => {
  // ── Renderizado con datos completos ────────────────────────────────────────

  it("debe mostrar el nombre del aventurero cuando se proporciona en la foto", () => {
    // Arrange & Act
    render(<PhotoCard photo={fotoCompleta} t={mockT} index={0} />);

    // Assert
    expect(screen.getByText("María García")).toBeInTheDocument();
  });

  it("debe mostrar el comentario de la foto cuando está disponible", () => {
    // Arrange & Act
    render(<PhotoCard photo={fotoCompleta} t={mockT} index={0} />);

    // Assert
    expect(
      screen.getByText("Las gafas en la Alhambra de Granada")
    ).toBeInTheDocument();
  });

  it("debe mostrar las coordenadas GPS formateadas con 2 decimales cuando lat y len son no nulos", () => {
    // Arrange & Act
    render(<PhotoCard photo={fotoCompleta} t={mockT} index={0} />);

    // Assert — coordenadas formateadas a 2 decimales
    expect(screen.getByText(/37\.18.*-3\.59/)).toBeInTheDocument();
  });

  it("debe renderizar la imagen con la URL correcta apuntando al servidor remoto", () => {
    // Arrange & Act
    render(<PhotoCard photo={fotoCompleta} t={mockT} index={0} />);

    // Assert
    const imagen = screen.getByRole("img");
    expect(imagen).toHaveAttribute(
      "src",
      "https://deveps.ddns.net/photos/foto_test.jpg"
    );
  });

  it("debe usar el comentario como texto alternativo de la imagen", () => {
    // Arrange & Act
    render(<PhotoCard photo={fotoCompleta} t={mockT} index={0} />);

    // Assert
    const imagen = screen.getByRole("img");
    expect(imagen).toHaveAttribute(
      "alt",
      "Las gafas en la Alhambra de Granada"
    );
  });

  // ── Renderizado con campos opcionales ausentes ─────────────────────────────

  it("debe mostrar el texto de aventurero anónimo cuando la foto no tiene nombre", () => {
    // Arrange & Act
    render(<PhotoCard photo={fotoMinima} t={mockT} index={0} />);

    // Assert
    expect(screen.getByText("Aventurero Anónimo")).toBeInTheDocument();
  });

  it("debe mostrar el texto de ubicación desconocida cuando las coordenadas son cero", () => {
    // Arrange & Act
    render(<PhotoCard photo={fotoMinima} t={mockT} index={0} />);

    // Assert
    expect(screen.getByText("Ubicación desconocida")).toBeInTheDocument();
  });

  it("debe mostrar texto por defecto cuando no hay comentario en la foto", () => {
    // Arrange & Act
    render(<PhotoCard photo={fotoMinima} t={mockT} index={0} />);

    // Assert
    expect(screen.getByText("Sin comentarios")).toBeInTheDocument();
  });

  it("debe usar el texto Adventure photo como alt cuando no hay comentario", () => {
    // Arrange & Act
    render(<PhotoCard photo={fotoMinima} t={mockT} index={0} />);

    // Assert
    const imagen = screen.getByRole("img");
    expect(imagen).toHaveAttribute("alt", "Adventure photo");
  });
});
