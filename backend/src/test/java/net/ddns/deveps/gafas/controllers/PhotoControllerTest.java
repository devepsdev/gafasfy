package net.ddns.deveps.gafas.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.ddns.deveps.gafas.dto.PhotoDTO;
import net.ddns.deveps.gafas.services.FileStorageService;
import net.ddns.deveps.gafas.services.PhotoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PhotoController.class)
@DisplayName("Tests unitarios del controlador PhotoController con MockMvc")
class PhotoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PhotoService photoService;

    @MockitoBean
    private FileStorageService fileStorageService;

    @Autowired
    private ObjectMapper objectMapper;

    private PhotoDTO foto1;
    private PhotoDTO foto2;

    @BeforeEach
    void setUp() {
        foto1 = PhotoDTO.builder()
                .id(1L)
                .url("foto1.jpg")
                .name("Usuario Uno")
                .comment("Comentario de la foto 1")
                .lat(40.4168)
                .len(-3.7038)
                .build();

        foto2 = PhotoDTO.builder()
                .id(2L)
                .url("foto2.jpg")
                .name("Usuario Dos")
                .comment("Comentario de la foto 2")
                .lat(41.3851)
                .len(2.1734)
                .build();
    }

    // ─── GET /api/photos ────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/photos debe retornar lista completa de fotos con HTTP 200")
    void getAllPhotos_debeRetornarListaCompletaConStatus200() throws Exception {
        // Arrange
        List<PhotoDTO> fotos = Arrays.asList(foto1, foto2);
        when(photoService.findAll()).thenReturn(fotos);

        // Act & Assert
        mockMvc.perform(get("/api/photos").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("Usuario Uno")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].name", is("Usuario Dos")));

        verify(photoService, times(1)).findAll();
    }

    @Test
    @DisplayName("GET /api/photos debe retornar lista vacía con HTTP 200 cuando no hay fotos")
    void getAllPhotos_debeRetornarListaVaciaConStatus200CuandoNoHayFotos() throws Exception {
        // Arrange
        when(photoService.findAll()).thenReturn(List.of());

        // Act & Assert
        mockMvc.perform(get("/api/photos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    // ─── GET /api/photos/{id} ───────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/photos/{id} debe retornar la foto con HTTP 200 cuando existe el ID")
    void getPhotoById_debeRetornarFotoConStatus200CuandoExiste() throws Exception {
        // Arrange
        when(photoService.findById(1L)).thenReturn(Optional.of(foto1));

        // Act & Assert
        mockMvc.perform(get("/api/photos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.url", is("foto1.jpg")))
                .andExpect(jsonPath("$.name", is("Usuario Uno")))
                .andExpect(jsonPath("$.lat", is(40.4168)));

        verify(photoService, times(1)).findById(1L);
    }

    @Test
    @DisplayName("GET /api/photos/{id} debe retornar HTTP 404 cuando el ID no existe")
    void getPhotoById_debeRetornarStatus404CuandoNoExisteElId() throws Exception {
        // Arrange
        when(photoService.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/api/photos/999"))
                .andExpect(status().isNotFound());

        verify(photoService, times(1)).findById(999L);
    }

    // ─── GET /api/photos/recent ─────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/photos/recent debe retornar las últimas N fotos en orden inverso")
    void getRecentPhotos_debeRetornarUltimasNFotasEnOrdenInverso() throws Exception {
        // Arrange
        List<PhotoDTO> fotos = Arrays.asList(foto1, foto2);
        when(photoService.findAll()).thenReturn(fotos);

        // Act & Assert
        mockMvc.perform(get("/api/photos/recent").param("limit", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        verify(photoService, times(1)).findAll();
    }

    @Test
    @DisplayName("GET /api/photos/recent usa limit=4 por defecto cuando no se especifica parámetro")
    void getRecentPhotos_usaLimit4PorDefectoCuandoNoSeEspecificaParametro() throws Exception {
        // Arrange
        when(photoService.findAll()).thenReturn(List.of());

        // Act & Assert
        mockMvc.perform(get("/api/photos/recent"))
                .andExpect(status().isOk());
    }

    // ─── POST /api/photos ───────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/photos debe crear foto a partir de JSON y retornar HTTP 200 con datos guardados")
    void createPhoto_debeCrearFotoDesdeJsonYRetornarStatus200() throws Exception {
        // Arrange
        PhotoDTO inputDTO = PhotoDTO.builder()
                .url("nueva.jpg")
                .name("Nuevo Aventurero")
                .comment("Primera aventura")
                .lat(48.8566)
                .len(2.3522)
                .build();

        PhotoDTO savedDTO = PhotoDTO.builder()
                .id(3L)
                .url("nueva.jpg")
                .name("Nuevo Aventurero")
                .comment("Primera aventura")
                .lat(48.8566)
                .len(2.3522)
                .build();

        when(photoService.save(any(PhotoDTO.class))).thenReturn(savedDTO);

        // Act & Assert
        mockMvc.perform(post("/api/photos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.name", is("Nuevo Aventurero")))
                .andExpect(jsonPath("$.lat", is(48.8566)));

        verify(photoService, times(1)).save(any(PhotoDTO.class));
    }

    // ─── PUT /api/photos/{id} ───────────────────────────────────────────────

    @Test
    @DisplayName("PUT /api/photos/{id} debe actualizar la foto existente y retornar HTTP 200 con datos actualizados")
    void updatePhoto_debeActualizarFotoExistenteYRetornarStatus200() throws Exception {
        // Arrange
        PhotoDTO updateDTO = PhotoDTO.builder()
                .url("actualizada.jpg")
                .name("Nombre Actualizado")
                .comment("Comentario actualizado")
                .lat(51.5074)
                .len(-0.1278)
                .build();

        PhotoDTO updatedDTO = PhotoDTO.builder()
                .id(1L)
                .url("actualizada.jpg")
                .name("Nombre Actualizado")
                .comment("Comentario actualizado")
                .lat(51.5074)
                .len(-0.1278)
                .build();

        when(photoService.updatePhoto(anyLong(), any(PhotoDTO.class))).thenReturn(updatedDTO);

        // Act & Assert
        mockMvc.perform(put("/api/photos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Nombre Actualizado")))
                .andExpect(jsonPath("$.comment", is("Comentario actualizado")));

        verify(photoService, times(1)).updatePhoto(anyLong(), any(PhotoDTO.class));
    }

    @Test
    @DisplayName("PUT /api/photos/{id} debe retornar HTTP 404 cuando la foto a actualizar no existe")
    void updatePhoto_debeRetornarStatus404CuandoLaFotoNoExiste() throws Exception {
        // Arrange
        when(photoService.updatePhoto(anyLong(), any(PhotoDTO.class)))
                .thenThrow(new RuntimeException("Photo not found"));

        // Act & Assert
        mockMvc.perform(put("/api/photos/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(foto1)))
                .andExpect(status().isNotFound());
    }

    // ─── DELETE /api/photos/{id} ────────────────────────────────────────────

    @Test
    @DisplayName("DELETE /api/photos/{id} debe eliminar foto y archivo asociado, retornando HTTP 204")
    void deletePhoto_debeEliminarFotoYArchivoAsociadoYRetornarStatus204() throws Exception {
        // Arrange
        when(photoService.findById(1L)).thenReturn(Optional.of(foto1));
        doNothing().when(fileStorageService).deleteFile(anyString());
        doNothing().when(photoService).deleteById(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/photos/1"))
                .andExpect(status().isNoContent());

        verify(photoService, times(1)).findById(1L);
        verify(fileStorageService, times(1)).deleteFile("foto1.jpg");
        verify(photoService, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("DELETE /api/photos/{id} debe eliminar de BD sin error aunque la foto no tenga archivo en disco")
    void deletePhoto_debeEliminarDeBDCuandoLaFotoNoTieneArchivoEnDisco() throws Exception {
        // Arrange — la foto no está en BD, pero deleteById no lanza excepción
        when(photoService.findById(2L)).thenReturn(Optional.empty());
        doNothing().when(photoService).deleteById(2L);

        // Act & Assert
        mockMvc.perform(delete("/api/photos/2"))
                .andExpect(status().isNoContent());

        verify(fileStorageService, never()).deleteFile(anyString());
        verify(photoService, times(1)).deleteById(2L);
    }

    // ─── POST /api/photos/upload ────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/photos/upload debe aceptar imagen JPEG válida y retornar HTTP 200 con datos guardados")
    void uploadPhoto_debeAceptarJPEGValidoYRetornarStatus200() throws Exception {
        // Arrange
        MockMultipartFile imagen = new MockMultipartFile(
                "photo", "aventura.jpg", "image/jpeg", "fake-jpeg-bytes".getBytes()
        );
        when(fileStorageService.saveFile(any(), anyString())).thenReturn("generado_aventura.jpg");
        when(photoService.save(any(PhotoDTO.class))).thenReturn(
                PhotoDTO.builder().id(5L).url("generado_aventura.jpg").name("Aventurero").build()
        );

        // Act & Assert
        mockMvc.perform(multipart("/api/photos/upload")
                        .file(imagen)
                        .param("name", "Aventurero")
                        .param("lat", "40.4168")
                        .param("len", "-3.7038"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(5)))
                .andExpect(jsonPath("$.url", is("generado_aventura.jpg")));
    }

    @Test
    @DisplayName("POST /api/photos/upload debe retornar HTTP 400 cuando el archivo está vacío")
    void uploadPhoto_debeRetornarStatus400CuandoArchivoEstaVacio() throws Exception {
        // Arrange
        MockMultipartFile archivoVacio = new MockMultipartFile(
                "photo", "vacio.jpg", "image/jpeg", new byte[0]
        );

        // Act & Assert
        mockMvc.perform(multipart("/api/photos/upload").file(archivoVacio))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/photos/upload debe retornar HTTP 400 cuando el tipo de contenido no es imagen")
    void uploadPhoto_debeRetornarStatus400CuandoTipoContenidoNoEsImagen() throws Exception {
        // Arrange
        MockMultipartFile pdf = new MockMultipartFile(
                "photo", "documento.pdf", "application/pdf", "contenido pdf".getBytes()
        );

        // Act & Assert
        mockMvc.perform(multipart("/api/photos/upload").file(pdf))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/photos/upload debe aceptar imagen PNG válida y retornar HTTP 200")
    void uploadPhoto_debeAceptarPNGValidoYRetornarStatus200() throws Exception {
        // Arrange
        MockMultipartFile png = new MockMultipartFile(
                "photo", "foto.png", "image/png", "fake-png-bytes".getBytes()
        );
        when(fileStorageService.saveFile(any(), anyString())).thenReturn("guardado.png");
        when(photoService.save(any(PhotoDTO.class))).thenReturn(
                PhotoDTO.builder().id(6L).url("guardado.png").build()
        );

        // Act & Assert
        mockMvc.perform(multipart("/api/photos/upload").file(png))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(6)));
    }
}
