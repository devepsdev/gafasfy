package net.ddns.deveps.gafas.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.ddns.deveps.gafas.dto.PhotoDTO;
import net.ddns.deveps.gafas.repositories.PhotoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("Tests de integración del controlador PhotoController con H2")
class PhotoControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PhotoRepository photoRepository;

    @BeforeEach
    void limpiarBaseDeDatos() {
        photoRepository.deleteAll();
    }

    // ─── GET /api/photos ────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/photos debe retornar lista vacía cuando la base de datos no tiene fotos")
    void getAllPhotos_debeRetornarListaVaciaCuandoBDEstaVacia() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/photos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    // ─── POST + GET ciclo completo ───────────────────────────────────────────

    @Test
    @DisplayName("POST /api/photos seguido de GET debe crear y recuperar la foto correctamente de la BD")
    void crearYRecuperarFoto_debePersistirYRecuperarDeLaBD() throws Exception {
        // Arrange
        PhotoDTO inputDTO = PhotoDTO.builder()
                .url("madrid.jpg")
                .name("Aventurero Madrid")
                .comment("Las gafas en la Gran Vía")
                .lat(40.4168)
                .len(-3.7038)
                .build();

        // Act — crear foto
        String respuestaJson = mockMvc.perform(post("/api/photos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name", is("Aventurero Madrid")))
                .andReturn().getResponse().getContentAsString();

        Long idCreado = objectMapper.readValue(respuestaJson, PhotoDTO.class).getId();

        // Assert — recuperar foto por ID
        mockMvc.perform(get("/api/photos/" + idCreado))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(idCreado.intValue())))
                .andExpect(jsonPath("$.name", is("Aventurero Madrid")))
                .andExpect(jsonPath("$.comment", is("Las gafas en la Gran Vía")))
                .andExpect(jsonPath("$.lat", is(40.4168)));
    }

    // ─── GET /api/photos/{id} ───────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/photos/{id} debe retornar HTTP 404 cuando el ID solicitado no existe en la BD")
    void getPhotoById_debeRetornar404CuandoIdNoExisteEnBD() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/photos/99999"))
                .andExpect(status().isNotFound());
    }

    // ─── PUT /api/photos/{id} ───────────────────────────────────────────────

    @Test
    @DisplayName("PUT /api/photos/{id} debe actualizar todos los campos de la foto en la BD y retornar HTTP 200")
    void updatePhoto_debeActualizarTodosLosCamposEnLaBD() throws Exception {
        // Arrange — crear foto original
        PhotoDTO original = PhotoDTO.builder()
                .url("original.jpg")
                .name("Nombre Original")
                .comment("Comentario original")
                .lat(0.0).len(0.0)
                .build();

        String respuestaCreacion = mockMvc.perform(post("/api/photos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(original)))
                .andReturn().getResponse().getContentAsString();

        Long idFoto = objectMapper.readValue(respuestaCreacion, PhotoDTO.class).getId();

        // Arrange — datos de actualización
        PhotoDTO actualizacion = PhotoDTO.builder()
                .url("actualizada.jpg")
                .name("Nombre Actualizado")
                .comment("Comentario actualizado")
                .lat(48.8566).len(2.3522)
                .build();

        // Act & Assert
        mockMvc.perform(put("/api/photos/" + idFoto)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(actualizacion)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Nombre Actualizado")))
                .andExpect(jsonPath("$.comment", is("Comentario actualizado")))
                .andExpect(jsonPath("$.lat", is(48.8566)))
                .andExpect(jsonPath("$.len", is(2.3522)));
    }

    @Test
    @DisplayName("PUT /api/photos/{id} debe retornar HTTP 404 cuando el ID a actualizar no existe en la BD")
    void updatePhoto_debeRetornar404CuandoIdNoExisteEnBD() throws Exception {
        // Arrange
        PhotoDTO dto = PhotoDTO.builder().url("x.jpg").name("X").build();

        // Act & Assert
        mockMvc.perform(put("/api/photos/99999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }

    // ─── DELETE /api/photos/{id} ────────────────────────────────────────────

    @Test
    @DisplayName("DELETE /api/photos/{id} debe eliminar la foto de la BD y retornar HTTP 204, sin poder recuperarla después")
    void deletePhoto_debeEliminarFotoDeLaBDYRetornar204() throws Exception {
        // Arrange — crear foto
        PhotoDTO dto = PhotoDTO.builder()
                .url("borrar.jpg")
                .name("Para Borrar")
                .build();

        String respuesta = mockMvc.perform(post("/api/photos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andReturn().getResponse().getContentAsString();

        Long idFoto = objectMapper.readValue(respuesta, PhotoDTO.class).getId();

        // Act — eliminar
        mockMvc.perform(delete("/api/photos/" + idFoto))
                .andExpect(status().isNoContent());

        // Assert — verificar que ya no existe
        mockMvc.perform(get("/api/photos/" + idFoto))
                .andExpect(status().isNotFound());
    }

    // ─── GET /api/photos/recent ─────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/photos/recent debe retornar exactamente 4 fotos por defecto cuando hay más de 4 en la BD")
    void getRecentPhotos_debeRetornar4FotosPorDefectoCuandoHayMasDe4() throws Exception {
        // Arrange — crear 6 fotos
        for (int i = 1; i <= 6; i++) {
            PhotoDTO dto = PhotoDTO.builder()
                    .url("foto" + i + ".jpg")
                    .name("Usuario " + i)
                    .build();
            mockMvc.perform(post("/api/photos")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk());
        }

        // Act & Assert — limit por defecto = 4
        mockMvc.perform(get("/api/photos/recent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)));
    }

    @Test
    @DisplayName("GET /api/photos/recent debe retornar todas las fotos cuando hay menos que el límite solicitado")
    void getRecentPhotos_debeRetornarTodasCuandoHayMenosQueElLimite() throws Exception {
        // Arrange — crear solo 2 fotos
        for (int i = 1; i <= 2; i++) {
            PhotoDTO dto = PhotoDTO.builder().url("foto" + i + ".jpg").build();
            mockMvc.perform(post("/api/photos")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk());
        }

        // Act & Assert — limit=10 pero solo hay 2
        mockMvc.perform(get("/api/photos/recent").param("limit", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    // ─── POST /api/photos/upload ────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/photos/upload debe rechazar archivo de tipo texto y retornar HTTP 400")
    void uploadPhoto_debeRechazarArchivoTextoCuandoNoEsImagen() throws Exception {
        // Arrange
        MockMultipartFile archivoTexto = new MockMultipartFile(
                "photo", "documento.txt", "text/plain", "esto no es una imagen".getBytes()
        );

        // Act & Assert
        mockMvc.perform(multipart("/api/photos/upload").file(archivoTexto))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/photos/upload debe persistir la foto en BD y retornar HTTP 200 con imagen JPEG válida")
    void uploadPhoto_debePersistirFotoEnBDConImagenJPEGValida() throws Exception {
        // Arrange
        MockMultipartFile imagen = new MockMultipartFile(
                "photo", "test_upload.jpg", "image/jpeg", "fake-jpeg-content".getBytes()
        );

        // Act & Assert
        mockMvc.perform(multipart("/api/photos/upload")
                        .file(imagen)
                        .param("name", "Test Upload Integration")
                        .param("comment", "Foto de prueba de integración")
                        .param("lat", "40.4168")
                        .param("len", "-3.7038"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name", is("Test Upload Integration")))
                .andExpect(jsonPath("$.url").isNotEmpty());
    }
}
