package net.ddns.deveps.gafas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PhotoDTO {
    private Long id;
    private String url;
    private String name;
    private String comment;
    private double lat;
    private double len;
}
