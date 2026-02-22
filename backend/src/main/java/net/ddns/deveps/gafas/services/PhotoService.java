package net.ddns.deveps.gafas.services;

import net.ddns.deveps.gafas.dto.PhotoDTO;

import java.util.List;
import java.util.Optional;

public interface PhotoService {
    List<PhotoDTO> findAll();
    Optional<PhotoDTO> findById(Long id);
    PhotoDTO save(PhotoDTO photoDTO);
    void deleteById(Long id);
    PhotoDTO updatePhoto(Long id, PhotoDTO photoDTO);
}
