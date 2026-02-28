package net.ddns.deveps.gafas.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Tests unitarios de FileStorageService")
class FileStorageServiceTest {

    private FileStorageService fileStorageService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService();
        ReflectionTestUtils.setField(fileStorageService, "uploadDir", tempDir.toString());
        fileStorageService.init();
    }

    // ─── saveFile ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("saveFile debe guardar el contenido del archivo en disco y retornar el nombre utilizado")
    void saveFile_debeGuardarContenidoEnDiscoYRetornarNombre() throws IOException {
        // Arrange
        byte[] contenido = "contenido de imagen de prueba".getBytes();
        MockMultipartFile archivo = new MockMultipartFile(
                "photo", "prueba.jpg", "image/jpeg", contenido
        );
        String nombreArchivo = "foto_guardada.jpg";

        // Act
        String resultado = fileStorageService.saveFile(archivo, nombreArchivo);

        // Assert
        assertThat(resultado).isEqualTo(nombreArchivo);
        Path rutaGuardada = tempDir.resolve(nombreArchivo);
        assertThat(Files.exists(rutaGuardada)).isTrue();
        assertThat(Files.readAllBytes(rutaGuardada)).isEqualTo(contenido);
    }

    @Test
    @DisplayName("saveFile debe sobreescribir el archivo si ya existe uno con el mismo nombre")
    void saveFile_debeSobreescribirArchivoExistente() throws IOException {
        // Arrange
        Path archivoExistente = tempDir.resolve("existente.jpg");
        Files.writeString(archivoExistente, "contenido antiguo");

        byte[] contenidoNuevo = "contenido nuevo".getBytes();
        MockMultipartFile archivo = new MockMultipartFile(
                "photo", "existente.jpg", "image/jpeg", contenidoNuevo
        );

        // Act
        fileStorageService.saveFile(archivo, "existente.jpg");

        // Assert
        assertThat(Files.readAllBytes(archivoExistente)).isEqualTo(contenidoNuevo);
    }

    // ─── deleteFile ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("deleteFile debe eliminar el archivo del disco cuando existe")
    void deleteFile_debeEliminarArchivoDelDisco() throws IOException {
        // Arrange
        Path archivo = tempDir.resolve("borrar.jpg");
        Files.writeString(archivo, "contenido a borrar");
        assertThat(Files.exists(archivo)).isTrue();

        // Act
        fileStorageService.deleteFile("borrar.jpg");

        // Assert
        assertThat(Files.exists(archivo)).isFalse();
    }

    @Test
    @DisplayName("deleteFile no debe lanzar excepción cuando el archivo a eliminar no existe")
    void deleteFile_noDebeLanzarExcepcionSiElArchivoNoExiste() {
        // Arrange — el archivo nunca fue creado

        // Act & Assert
        assertThatCode(() -> fileStorageService.deleteFile("archivo_inexistente.jpg"))
                .doesNotThrowAnyException();
    }

    // ─── fileExists ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("fileExists debe retornar true cuando el archivo existe en el directorio")
    void fileExists_debeRetornarTrueSiElArchivoExiste() throws IOException {
        // Arrange
        Path archivo = tempDir.resolve("existe.jpg");
        Files.writeString(archivo, "contenido");

        // Act
        boolean resultado = fileStorageService.fileExists("existe.jpg");

        // Assert
        assertThat(resultado).isTrue();
    }

    @Test
    @DisplayName("fileExists debe retornar false cuando el archivo no existe en el directorio")
    void fileExists_debeRetornarFalseSiElArchivoNoExiste() {
        // Act
        boolean resultado = fileStorageService.fileExists("no_existe.jpg");

        // Assert
        assertThat(resultado).isFalse();
    }

    // ─── getFilePath ────────────────────────────────────────────────────────

    @Test
    @DisplayName("getFilePath debe retornar la ruta absoluta correcta para el nombre de archivo dado")
    void getFilePath_debeRetornarRutaAbsolutaCorrecta() {
        // Act
        Path resultado = fileStorageService.getFilePath("foto.jpg");

        // Assert
        assertThat(resultado).isEqualTo(tempDir.resolve("foto.jpg"));
    }

    // ─── getUploadDir ───────────────────────────────────────────────────────

    @Test
    @DisplayName("getUploadDir debe retornar el directorio de subida configurado mediante inyección")
    void getUploadDir_debeRetornarElDirectorioConfigurado() {
        // Act
        String resultado = fileStorageService.getUploadDir();

        // Assert
        assertThat(resultado).isEqualTo(tempDir.toString());
    }
}
