package net.ddns.deveps.gafas.mappers;

import net.ddns.deveps.gafas.dto.PhotoDTO;
import net.ddns.deveps.gafas.entities.Photo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PhotoMapper {
    PhotoDTO toDTO(Photo photo);

    @Mapping(target = "timestamp", ignore = true)
    Photo toEntity(PhotoDTO photoDTO);

    List<PhotoDTO> toDTOList(List<Photo> photos);
    List<Photo> toEntityList(List<PhotoDTO> photoDTOs);
}
