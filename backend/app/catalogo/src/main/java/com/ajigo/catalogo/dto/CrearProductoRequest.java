package com.ajigo.catalogo.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class CrearProductoRequest {

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String nombreProducto;

    private String descripcion;
    private String imagenUrl;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    private Double precio;

    private Double rating = 0.0;
    private Integer stock = 0;
    private Integer spicyLevel = 0;
    private String tag;
    private String badgeText;

    @NotNull(message = "La sucursal es obligatoria")
    private Long sucursalId;

    @NotNull(message = "La categoría es obligatoria")
    private Long categoriaId;
}