import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PhotoUploadForm from "../PhotoUploadForm";

// Traducciones mínimas para pruebas
const mockT = {
  takePhoto: "Hacer Foto",
  openCamera: "Abrir Cámara",
  fromGallery: "O subir desde galería",
  addDetails: "Añadir Detalles",
  yourName: "Tu nombre (opcional)",
  comment: "Cuéntanos sobre este lugar...",
  submit: "Enviar Aventura",
  changePhoto: "Cambiar Foto",
  uploading: "Subiendo...",
  fillForm: "¡Ahora completa los detalles!",
  photoUploaded: "¡Foto subida con éxito!",
  uploadError: "Error al subir la foto",
};

// Archivo de imagen de prueba
const crearArchivoImagen = (nombre = "test.jpg", tipo = "image/jpeg") =>
  new File(["contenido-fake"], nombre, { type: tipo });

describe("PhotoUploadForm", () => {
  // ── Paso inicial: selección de foto ────────────────────────────────────────

  it("debe mostrar el paso de selección de foto al cargar el componente por primera vez", () => {
    // Arrange & Act
    render(<PhotoUploadForm t={mockT} onSuccess={vi.fn()} />);

    // Assert
    expect(screen.getByText("Hacer Foto")).toBeInTheDocument();
  });

  it("debe mostrar el botón de abrir cámara en el paso inicial de foto", () => {
    // Arrange & Act
    render(<PhotoUploadForm t={mockT} onSuccess={vi.fn()} />);

    // Assert
    expect(
      screen.getByRole("button", { name: /Abrir Cámara/i })
    ).toBeInTheDocument();
  });

  it("debe mostrar la opción para subir desde galería en el paso inicial de foto", () => {
    // Arrange & Act
    render(<PhotoUploadForm t={mockT} onSuccess={vi.fn()} />);

    // Assert
    expect(screen.getByText(/O subir desde galería/i)).toBeInTheDocument();
  });

  it("debe mostrar el input de tipo file oculto para seleccionar desde galería", () => {
    // Arrange & Act
    const { container } = render(
      <PhotoUploadForm t={mockT} onSuccess={vi.fn()} />
    );

    // Assert
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("accept", "image/*");
  });

  // ── Transición al paso de detalles ─────────────────────────────────────────

  it("debe avanzar al paso de detalles cuando el usuario selecciona un archivo desde galería", async () => {
    // Arrange
    render(<PhotoUploadForm t={mockT} onSuccess={vi.fn()} />);
    const archivo = crearArchivoImagen();
    const input = document.querySelector('input[type="file"]');

    // Act
    fireEvent.change(input, { target: { files: [archivo] } });

    // Assert
    await waitFor(() => {
      expect(screen.getByText("¡Ahora completa los detalles!")).toBeInTheDocument();
    });
  });

  it("debe mostrar el input de nombre en el paso de detalles", async () => {
    // Arrange
    render(<PhotoUploadForm t={mockT} onSuccess={vi.fn()} />);
    const archivo = crearArchivoImagen();
    const input = document.querySelector('input[type="file"]');

    // Act
    fireEvent.change(input, { target: { files: [archivo] } });

    // Assert
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Tu nombre...")
      ).toBeInTheDocument();
    });
  });

  it("debe mostrar el textarea de comentario en el paso de detalles", async () => {
    // Arrange
    render(<PhotoUploadForm t={mockT} onSuccess={vi.fn()} />);
    const archivo = crearArchivoImagen();
    const input = document.querySelector('input[type="file"]');

    // Act
    fireEvent.change(input, { target: { files: [archivo] } });

    // Assert
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Cuéntanos sobre tu aventura/i)
      ).toBeInTheDocument();
    });
  });

  it("debe mostrar el botón de cambiar foto en el paso de detalles", async () => {
    // Arrange
    render(<PhotoUploadForm t={mockT} onSuccess={vi.fn()} />);
    const archivo = crearArchivoImagen();
    const input = document.querySelector('input[type="file"]');

    // Act
    fireEvent.change(input, { target: { files: [archivo] } });

    // Assert
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Cambiar Foto" })
      ).toBeInTheDocument();
    });
  });

  it("debe volver al paso de foto al hacer clic en cambiar foto", async () => {
    // Arrange
    render(<PhotoUploadForm t={mockT} onSuccess={vi.fn()} />);
    const archivo = crearArchivoImagen();
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [archivo] } });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Cambiar Foto" })).toBeInTheDocument();
    });

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Cambiar Foto" }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Hacer Foto")).toBeInTheDocument();
    });
  });

  // ── Envío del formulario ───────────────────────────────────────────────────

  it("debe permitir escribir en el input de nombre del formulario de detalles", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PhotoUploadForm t={mockT} onSuccess={vi.fn()} />);
    const archivo = crearArchivoImagen();
    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: [archivo] },
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Tu nombre...")).toBeInTheDocument();
    });

    // Act
    const inputNombre = screen.getByPlaceholderText("Tu nombre...");
    await user.type(inputNombre, "Ana Viajera");

    // Assert
    expect(inputNombre).toHaveValue("Ana Viajera");
  });

  it("debe mostrar estado de carga en el botón de enviar mientras se sube la foto", async () => {
    // Arrange — fetch que nunca resuelve para mantener el estado de carga
    global.fetch = vi.fn(() => new Promise(() => {}));

    render(<PhotoUploadForm t={mockT} onSuccess={vi.fn()} />);
    const archivo = crearArchivoImagen();
    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: [archivo] },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Enviar Aventura/i })).toBeInTheDocument();
    });

    // Act
    fireEvent.click(screen.getByRole("button", { name: /Enviar Aventura/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Subiendo...")).toBeInTheDocument();
    });
  });

  it("debe llamar a onSuccess tras una subida exitosa de la foto", async () => {
    // Arrange
    const onSuccessMock = vi.fn();
    global.fetch = vi.fn(() => Promise.resolve({ ok: true }));

    // render() DEBE ir antes de cualquier mock de document.body para que
    // React Testing Library pueda insertar su contenedor en el DOM
    render(<PhotoUploadForm t={mockT} onSuccess={onSuccessMock} />);
    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: [crearArchivoImagen()] },
    });

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Enviar Aventura/i })).toBeInTheDocument()
    );

    // Suprimir la animación DOM que el componente inserta dinámicamente
    vi.spyOn(document.body, "appendChild").mockImplementation(() => {});
    vi.spyOn(document.body, "removeChild").mockImplementation(() => {});

    // Act
    fireEvent.click(screen.getByRole("button", { name: /Enviar Aventura/i }));

    // Assert — se espera hasta 3 s para cubrir el setTimeout de 2000 ms del componente
    await waitFor(() => expect(onSuccessMock).toHaveBeenCalledTimes(1), {
      timeout: 3000,
    });
  });
});
