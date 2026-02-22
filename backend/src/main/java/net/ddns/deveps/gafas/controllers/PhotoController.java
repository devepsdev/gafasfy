package net.ddns.deveps.gafas.controllers;

import net.ddns.deveps.gafas.dto.PhotoDTO;
import net.ddns.deveps.gafas.services.PhotoService;
import net.ddns.deveps.gafas.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/photos")
@CrossOrigin(origins = "*")
public class PhotoController {

    @Autowired
    private PhotoService photoService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public List<PhotoDTO> getAllPhotos() {
        return photoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhotoDTO> getPhotoById(@PathVariable Long id) {
        return photoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recent")
    public List<PhotoDTO> getRecentPhotos(@RequestParam(defaultValue = "4") int limit) {
        List<PhotoDTO> allPhotos = photoService.findAll();
        return allPhotos.stream()
                .skip(Math.max(0, allPhotos.size() - limit))
                .collect(Collectors.toList())
                .reversed(); // Más recientes primero
    }

    @PostMapping("/upload")
    public ResponseEntity<PhotoDTO> uploadPhoto(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "comment", required = false) String comment,
            @RequestParam(value = "lat", defaultValue = "0.0") double lat,
            @RequestParam(value = "len", defaultValue = "0.0") double len) {

        try {
            // Validar que el archivo sea una imagen
            if (photo.isEmpty() || !isValidImageFile(photo)) {
                return ResponseEntity.badRequest().build();
            }

            // Generar nombre único para el archivo
            String fileName = generateUniqueFileName(photo.getOriginalFilename());

            // Guardar archivo en el sistema de archivos
            String savedFileName = fileStorageService.saveFile(photo, fileName);

            // Crear PhotoDTO con los datos
            PhotoDTO photoDTO = PhotoDTO.builder()
                    .url(savedFileName)  // Solo el nombre del archivo
                    .name(name != null && !name.trim().isEmpty() ? name.trim() : null)
                    .comment(comment != null && !comment.trim().isEmpty() ? comment.trim() : null)
                    .lat(lat)
                    .len(len)
                    .build();

            // Guardar en base de datos
            PhotoDTO savedPhoto = photoService.save(photoDTO);

            return ResponseEntity.ok(savedPhoto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public PhotoDTO createPhoto(@RequestBody PhotoDTO photoDTO) {
        return photoService.save(photoDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhotoDTO> updatePhoto(
            @PathVariable Long id,
            @RequestBody PhotoDTO photoDTO) {
        try {
            return ResponseEntity.ok(photoService.updatePhoto(id, photoDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long id) {
        try {
            // Obtener la foto para conseguir el nombre del archivo
            Optional<PhotoDTO> photoOpt = photoService.findById(id);
            if (photoOpt.isPresent()) {
                // Eliminar archivo del sistema de archivos
                fileStorageService.deleteFile(photoOpt.get().getUrl());
            }

            // Eliminar de la base de datos
            photoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private boolean isValidImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (
                contentType.equals("image/jpeg") ||
                        contentType.equals("image/jpg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/gif") ||
                        contentType.equals("image/webp")
        );
    }

    private String generateUniqueFileName(String originalFilename) {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String extension = getFileExtension(originalFilename);
        return timestamp + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
    }

    private String getFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf(".")).toLowerCase();
        }
        return ".jpg"; // extensión por defecto
    }
}