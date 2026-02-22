package net.ddns.deveps.gafas.services.impl;

import net.ddns.deveps.gafas.dto.PhotoDTO;
import net.ddns.deveps.gafas.entities.Photo;
import net.ddns.deveps.gafas.mappers.PhotoMapper;
import net.ddns.deveps.gafas.repositories.PhotoRepository;
import net.ddns.deveps.gafas.services.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PhotoServiceImpl implements PhotoService {

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private PhotoMapper photoMapper;

    @Override
    public List<PhotoDTO> findAll() {
        return photoMapper.toDTOList(photoRepository.findAll());
    }

    @Override
    public Optional<PhotoDTO> findById(Long id) {
        return photoRepository.findById(id)
                .map(photoMapper::toDTO);
    }

    @Override
    public PhotoDTO save(PhotoDTO photoDTO) {
        Photo photo = photoMapper.toEntity(photoDTO);
        return photoMapper.toDTO(photoRepository.save(photo));
    }

    @Override
    public void deleteById(Long id) {
        photoRepository.deleteById(id);
    }

    @Override
    public PhotoDTO updatePhoto(Long id, PhotoDTO photoDTO) {
        return photoRepository.findById(id)
                .map(existing -> {
                    existing.setUrl(photoDTO.getUrl());
                    existing.setName(photoDTO.getName());
                    existing.setComment(photoDTO.getComment());
                    existing.setLat(photoDTO.getLat());
                    existing.setLen(photoDTO.getLen());
                    return photoMapper.toDTO(photoRepository.save(existing));
                })
                .orElseThrow(() -> new RuntimeException("Photo not found with id " + id));
    }
}
