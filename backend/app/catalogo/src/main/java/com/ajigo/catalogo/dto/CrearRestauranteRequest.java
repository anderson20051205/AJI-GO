package com.ajigo.catalogo.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class CrearRestauranteRequest {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombreRestaurante;
    private String descripcion;
    private String logoUrl;
}