import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UploadPage from "../UploadPage";

const mockT = {
  backHome: "← Volver al inicio",
  addDetails: "Añadir Detalles",
  takePhoto: "Hacer Foto",
  openCamera: "Abrir Cámara",
  fromGallery: "O subir desde galería",
  yourName: "Tu nombre (opcional)",
  comment: "Cuéntanos sobre este lugar...",
  submit: "Enviar Aventura",
  changePhoto: "Cambiar Foto",
  uploading: "Subiendo...",
  fillForm: "¡Ahora completa los detalles!",
  photoUploaded: "¡Foto subida con éxito!",
  uploadError: "Error al subir la foto",
};

describe("UploadPage", () => {
  // ── Renderizado ────────────────────────────────────────────────────────────

  it("debe renderizar el título de la página de subida correctamente", () => {
    // Arrange & Act
    render(<UploadPage onNavigate={vi.fn()} t={mockT} />);

    // Assert
    expect(screen.getByText("Añadir Detalles")).toBeInTheDocument();
  });

  it("debe mostrar el botón de volver al inicio con el texto de traducción", () => {
    // Arrange & Act
    render(<UploadPage onNavigate={vi.fn()} t={mockT} />);

    // Assert — el texto está contenido en el botón de retroceso
    expect(screen.getByText(/Volver al inicio/i)).toBeInTheDocument();
  });

  it("debe renderizar el formulario de subida de fotos dentro de la página", () => {
    // Arrange & Act
    render(<UploadPage onNavigate={vi.fn()} t={mockT} />);

    // Assert — el formulario tiene el botón inicial de abrir cámara
    expect(screen.getByRole("button", { name: /Abrir Cámara/i })).toBeInTheDocument();
  });

  it("debe renderizar el footer con el texto del copyright", () => {
    // Arrange & Act
    render(<UploadPage onNavigate={vi.fn()} t={mockT} />);

    // Assert
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  // ── Navegación ─────────────────────────────────────────────────────────────

  it("debe llamar a onNavigate con home al hacer clic en el botón de volver al inicio", () => {
    // Arrange
    const onNavigateMock = vi.fn();
    render(<UploadPage onNavigate={onNavigateMock} t={mockT} />);

    // Act — el botón de retroceso contiene el texto backHome
    const botonVolver = screen.getByRole("button", { name: /Volver al inicio/i });
    fireEvent.click(botonVolver);

    // Assert
    expect(onNavigateMock).toHaveBeenCalledWith("home");
    expect(onNavigateMock).toHaveBeenCalledTimes(1);
  });
});
