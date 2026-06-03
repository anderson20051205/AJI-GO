package com.ajigo.catalogo.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RestauranteDTO {
    private Long restauranteId;
    private String id;               // slug: "piedra-negra", "el-capi" — para el frontend
    private String nombreRestaurante;
    private String badgeText;
    private String tagline;
    private String descripcion;
    private String logoUrl;
    private Double rating;
    private Boolean activo;
    private Boolean estaAbierto;     // viene de la sucursal
    private Long sucursalId;         // la sucursal del campus UIDE
}
