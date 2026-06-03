package com.ajigo.catalogo.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class CrearRestauranteRequest {

    @NotBlank(message = "El nombre del restaurante es obligatorio")
    private String nombreRestaurante;

    @NotBlank(message = "El badgeText es obligatorio")
    private String badgeText;     // "PN", "EC", "CO", "UB"

    private String tagline;
    private String descripcion;
    private String logoUrl;
    private Double rating = 0.0;
}