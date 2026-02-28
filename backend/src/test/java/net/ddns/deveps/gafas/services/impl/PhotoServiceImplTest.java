package net.ddns.deveps.gafas.services.impl;

import net.ddns.deveps.gafas.dto.PhotoDTO;
import net.ddns.deveps.gafas.entities.Photo;
import net.ddns.deveps.gafas.mappers.PhotoMapper;
import net.ddns.deveps.gafas.repositories.PhotoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests unitarios de PhotoServiceImpl")
class PhotoServiceImplTest {

    @Mock
    private PhotoRepository photoRepository;

    @Mock
    private PhotoMapper photoMapper;

    @InjectMocks
    private PhotoServiceImpl photoService;

    private Photo photo;
    private PhotoDTO photoDTO;

    @BeforeEach
    void setUp() {
        photo = Photo.builder()
                .id(1L)
                .url("test_image.jpg")
                .name("Usuario Test")
                .comment("Comentario de prueba")
                .lat(40.4168)
                .len(-3.7038)
                .build();

        photoDTO = PhotoDTO.builder()
                .id(1L)
                .url("test_image.jpg")
                .name("Usuario Test")
                .comment("Comentario de prueba")
                .lat(40.4168)
                .len(-3.7038)
                .build();
    }

    // ─── findAll ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("findAll debe retornar lista de PhotoDTOs cuando hay fotos en la base de datos")
    void findAll_debeRetornarListaDeFotosDTOCuandoHayDatos() {
        // Arrange
        List<Photo> photos = Arrays.asList(photo);
        List<PhotoDTO> photoDTOs = Arrays.asList(photoDTO);
        when(photoRepository.findAll()).thenReturn(photos);
        when(photoMapper.toDTOList(photos)).thenReturn(photoDTOs);

        // Act
        List<PhotoDTO> resultado = photoService.findAll();

        // Assert
        assertThat(resultado).isNotNull().hasSize(1);
        assertThat(resultado.get(0).getId()).isEqualTo(1L);
        assertThat(resultado.get(0).getUrl()).isEqualTo("test_image.jpg");
        verify(photoRepository, times(1)).findAll();
        verify(photoMapper, times(1)).toDTOList(photos);
    }

    @Test
    @DisplayName("findAll debe retornar lista vacía cuando no existen fotos en la base de datos")
    void findAll_debeRetornarListaVaciaCuandoNoHayDatos() {
        // Arrange
        when(photoRepository.findAll()).thenReturn(List.of());
        when(photoMapper.toDTOList(List.of())).thenReturn(List.of());

        // Act
        List<PhotoDTO> resultado = photoService.findAll();

        // Assert
        assertThat(resultado).isNotNull().isEmpty();
        verify(photoRepository, times(1)).findAll();
    }

    // ─── findById ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("findById debe retornar Optional con PhotoDTO cuando la foto con ese ID existe")
    void findById_debeRetornarOptionalConDatoCuandoExiste() {
        // Arrange
        when(photoRepository.findById(1L)).thenReturn(Optional.of(photo));
        when(photoMapper.toDTO(photo)).thenReturn(photoDTO);

        // Act
        Optional<PhotoDTO> resultado = photoService.findById(1L);

        // Assert
        assertThat(resultado).isPresent();
        assertThat(resultado.get().getId()).isEqualTo(1L);
        assertThat(resultado.get().getName()).isEqualTo("Usuario Test");
        verify(photoRepository, times(1)).findById(1L);
        verify(photoMapper, times(1)).toDTO(photo);
    }

    @Test
    @DisplayName("findById debe retornar Optional vacío cuando no existe foto con ese ID")
    void findById_debeRetornarOptionalVacioCuandoNoExiste() {
        // Arrange
        when(photoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<PhotoDTO> resultado = photoService.findById(999L);

        // Assert
        assertThat(resultado).isEmpty();
        verify(photoRepository, times(1)).findById(999L);
        verify(photoMapper, never()).toDTO(any());
    }

    // ─── save ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("save debe persistir la foto y retornar el PhotoDTO con todos sus datos")
    void save_debePersistirYRetornarElPhotoDTOCompleto() {
        // Arrange
        when(photoMapper.toEntity(photoDTO)).thenReturn(photo);
        when(photoRepository.save(photo)).thenReturn(photo);
        when(photoMapper.toDTO(photo)).thenReturn(photoDTO);

        // Act
        PhotoDTO resultado = photoService.save(photoDTO);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getUrl()).isEqualTo("test_image.jpg");
        assertThat(resultado.getName()).isEqualTo("Usuario Test");
        verify(photoMapper, times(1)).toEntity(photoDTO);
        verify(photoRepository, times(1)).save(photo);
        verify(photoMapper, times(1)).toDTO(photo);
    }

    // ─── deleteById ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("deleteById debe delegar al repositorio exactamente una vez con el ID proporcionado")
    void deleteById_debeDelegarAlRepositorioConElIdCorrecto() {
        // Arrange
        doNothing().when(photoRepository).deleteById(1L);

        // Act
        photoService.deleteById(1L);

        // Assert
        verify(photoRepository, times(1)).deleteById(1L);
    }

    // ─── updatePhoto ────────────────────────────────────────────────────────

    @Test
    @DisplayName("updatePhoto debe actualizar los campos y retornar el DTO con los nuevos valores cuando la foto existe")
    void updatePhoto_debeActualizarCamposYRetornarDTOActualizadoCuandoExiste() {
        // Arrange
        PhotoDTO datosActualizados = PhotoDTO.builder()
                .url("imagen_actualizada.jpg")
                .name("Nombre Actualizado")
                .comment("Comentario actualizado")
                .lat(41.3851)
                .len(2.1734)
                .build();

        Photo fotoActualizada = Photo.builder()
                .id(1L)
                .url("imagen_actualizada.jpg")
                .name("Nombre Actualizado")
                .comment("Comentario actualizado")
                .lat(41.3851)
                .len(2.1734)
                .build();

        PhotoDTO dtoActualizado = PhotoDTO.builder()
                .id(1L)
                .url("imagen_actualizada.jpg")
                .name("Nombre Actualizado")
                .comment("Comentario actualizado")
                .lat(41.3851)
                .len(2.1734)
                .build();

        when(photoRepository.findById(1L)).thenReturn(Optional.of(photo));
        when(photoRepository.save(any(Photo.class))).thenReturn(fotoActualizada);
        when(photoMapper.toDTO(fotoActualizada)).thenReturn(dtoActualizado);

        // Act
        PhotoDTO resultado = photoService.updatePhoto(1L, datosActualizados);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getUrl()).isEqualTo("imagen_actualizada.jpg");
        assertThat(resultado.getName()).isEqualTo("Nombre Actualizado");
        assertThat(resultado.getLat()).isEqualTo(41.3851);
        verify(photoRepository, times(1)).findById(1L);
        verify(photoRepository, times(1)).save(any(Photo.class));
    }

    @Test
    @DisplayName("updatePhoto debe lanzar RuntimeException con mensaje descriptivo cuando la foto no existe")
    void updatePhoto_debeLanzarRuntimeExceptionCuandoLaFotoNoExiste() {
        // Arrange
        when(photoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> photoService.updatePhoto(999L, photoDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Photo not found with id 999");

        verify(photoRepository, times(1)).findById(999L);
        verify(photoRepository, never()).save(any());
    }
}
