package net.ddns.deveps.gafas.services;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {

    @Value("${file.upload.dir:#{systemProperties['user.home']}/photos}")
    private String uploadDir;

    public FileStorageService() {
        // Se ejecutará después de la inyección de dependencias
    }

    @PostConstruct
    public void init() {
        createUploadDirIfNotExists();
    }

    private void createUploadDirIfNotExists() {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);
                System.out.println("Directorio de subida creado: " + uploadDir);
            } catch (IOException e) {
                throw new RuntimeException("No se pudo crear el directorio de subida: " + uploadDir, e);
            }
        } else {
            System.out.println("Usando directorio de subida existente: " + uploadDir);
        }
    }

    public String saveFile(MultipartFile file, String fileName) throws IOException {
        Path filePath = Paths.get(uploadDir, fileName);

        // Asegurar que el directorio padre existe
        Files.createDirectories(filePath.getParent());

        // Copiar el archivo
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("Archivo guardado: " + filePath.toString());
        return fileName;
    }

    public void deleteFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir, fileName);
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) {
                System.out.println("Archivo eliminado: " + fileName);
            }
        } catch (IOException e) {
            System.err.println("Error al eliminar archivo: " + fileName + " - " + e.getMessage());
        }
    }

    public boolean fileExists(String fileName) {
        Path filePath = Paths.get(uploadDir, fileName);
        return Files.exists(filePath);
    }

    public Path getFilePath(String fileName) {
        return Paths.get(uploadDir, fileName);
    }

    public String getUploadDir() {
        return uploadDir;
    }
}