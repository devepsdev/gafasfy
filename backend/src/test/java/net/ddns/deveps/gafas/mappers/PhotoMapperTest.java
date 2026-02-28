package net.ddns.deveps.gafas.mappers;

import net.ddns.deveps.gafas.dto.PhotoDTO;
import net.ddns.deveps.gafas.entities.Photo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Tests del mapper PhotoMapper (MapStruct)")
class PhotoMapperTest {

    // Se instancia directamente la implementación generada por MapStruct
    private PhotoMapper photoMapper;

    @BeforeEach
    void setUp() {
        photoMapper = new PhotoMapperImpl();
    }

    // ─── toDTO ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("toDTO debe mapear correctamente todos los campos de Photo a PhotoDTO")
    void toDTO_debeMappearTodosLosCamposDePhotoAPhotoDTO() {
        // Arrange
        Photo photo = Photo.builder()
                .id(1L)
                .url("sagrada_familia.jpg")
                .name("Aventurero Barcelona")
                .comment("Las gafas en la Sagrada Familia")
                .lat(41.4036)
                .len(2.1744)
                .timestamp(LocalDateTime.of(2024, 6, 15, 10, 30))
                .build();

        // Act
        PhotoDTO resultado = photoMapper.toDTO(photo);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getUrl()).isEqualTo("sagrada_familia.jpg");
        assertThat(resultado.getName()).isEqualTo("Aventurero Barcelona");
        assertThat(resultado.getComment()).isEqualTo("Las gafas en la Sagrada Familia");
        assertThat(resultado.getLat()).isEqualTo(41.4036);
        assertThat(resultado.getLen()).isEqualTo(2.1744);
    }

    @Test
    @DisplayName("toDTO debe retornar null cuando la entidad Photo proporcionada es null")
    void toDTO_debeRetornarNullCuandoLaEntidadEsNull() {
        // Act
        PhotoDTO resultado = photoMapper.toDTO(null);

        // Assert
        assertThat(resultado).isNull();
    }

    @Test
    @DisplayName("toDTO debe mapear campos opcionales como null cuando no están asignados en la entidad")
    void toDTO_debeMappearCamposOpcionalesComoNullSiNoEstan() {
        // Arrange — solo url es obligatoria
        Photo photo = Photo.builder()
                .id(2L)
                .url("foto_minima.jpg")
                .build();

        // Act
        PhotoDTO resultado = photoMapper.toDTO(photo);

        // Assert
        assertThat(resultado.getId()).isEqualTo(2L);
        assertThat(resultado.getUrl()).isEqualTo("foto_minima.jpg");
        assertThat(resultado.getName()).isNull();
        assertThat(resultado.getComment()).isNull();
    }

    // ─── toEntity ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("toEntity debe mapear correctamente PhotoDTO a Photo ignorando el campo timestamp")
    void toEntity_debeMappearCorrectamenteSinIncluirTimestamp() {
        // Arrange
        PhotoDTO photoDTO = PhotoDTO.builder()
                .id(1L)
                .url("coliseo.jpg")
                .name("Aventurero Roma")
                .comment("Las gafas en el Coliseo")
                .lat(41.8902)
                .len(12.4922)
                .build();

        // Act
        Photo resultado = photoMapper.toEntity(photoDTO);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getUrl()).isEqualTo("coliseo.jpg");
        assertThat(resultado.getName()).isEqualTo("Aventurero Roma");
        assertThat(resultado.getComment()).isEqualTo("Las gafas en el Coliseo");
        assertThat(resultado.getLat()).isEqualTo(41.8902);
        assertThat(resultado.getLen()).isEqualTo(12.4922);
        assertThat(resultado.getTimestamp()).isNull();  // siempre ignorado
    }

    @Test
    @DisplayName("toEntity debe retornar null cuando el PhotoDTO proporcionado es null")
    void toEntity_debeRetornarNullCuandoElDTOEsNull() {
        // Act
        Photo resultado = photoMapper.toEntity(null);

        // Assert
        assertThat(resultado).isNull();
    }

    @Test
    @DisplayName("toEntity nunca debe establecer el timestamp aunque el DTO tenga campos asignados")
    void toEntity_nuncaDebeEstablecerTimestamp() {
        // Arrange
        PhotoDTO dto = PhotoDTO.builder()
                .id(5L)
                .url("foto_ts.jpg")
                .build();

        // Act
        Photo resultado = photoMapper.toEntity(dto);

        // Assert — el mapper ignora timestamp explícitamente
        assertThat(resultado.getTimestamp()).isNull();
    }

    // ─── toDTOList ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("toDTOList debe mapear cada elemento de la lista de Photo a PhotoDTO correctamente")
    void toDTOList_debeMappearCadaElementoDeLaLista() {
        // Arrange
        Photo photo1 = Photo.builder().id(1L).url("foto1.jpg").name("User1").lat(40.0).len(-3.0).build();
        Photo photo2 = Photo.builder().id(2L).url("foto2.jpg").name("User2").lat(51.5).len(-0.1).build();
        List<Photo> fotos = Arrays.asList(photo1, photo2);

        // Act
        List<PhotoDTO> resultado = photoMapper.toDTOList(fotos);

        // Assert
        assertThat(resultado).isNotNull().hasSize(2);
        assertThat(resultado.get(0).getId()).isEqualTo(1L);
        assertThat(resultado.get(0).getUrl()).isEqualTo("foto1.jpg");
        assertThat(resultado.get(1).getId()).isEqualTo(2L);
        assertThat(resultado.get(1).getUrl()).isEqualTo("foto2.jpg");
    }

    @Test
    @DisplayName("toDTOList debe retornar lista vacía cuando recibe una lista vacía de entidades")
    void toDTOList_debeRetornarListaVaciaCuandoRecibeListaVacia() {
        // Act
        List<PhotoDTO> resultado = photoMapper.toDTOList(List.of());

        // Assert
        assertThat(resultado).isNotNull().isEmpty();
    }

    @Test
    @DisplayName("toDTOList debe retornar null cuando recibe null")
    void toDTOList_debeRetornarNullCuandoRecibeNull() {
        // Act
        List<PhotoDTO> resultado = photoMapper.toDTOList(null);

        // Assert
        assertThat(resultado).isNull();
    }

    // ─── toEntityList ───────────────────────────────────────────────────────

    @Test
    @DisplayName("toEntityList debe mapear cada DTO de la lista a Photo correctamente")
    void toEntityList_debeMappearCadaDTODeLaLista() {
        // Arrange
        PhotoDTO dto1 = PhotoDTO.builder().id(1L).url("foto1.jpg").build();
        PhotoDTO dto2 = PhotoDTO.builder().id(2L).url("foto2.jpg").build();
        List<PhotoDTO> dtos = Arrays.asList(dto1, dto2);

        // Act
        List<Photo> resultado = photoMapper.toEntityList(dtos);

        // Assert
        assertThat(resultado).isNotNull().hasSize(2);
        assertThat(resultado.get(0).getId()).isEqualTo(1L);
        assertThat(resultado.get(1).getId()).isEqualTo(2L);
        resultado.forEach(p -> assertThat(p.getTimestamp()).isNull());
    }
}
