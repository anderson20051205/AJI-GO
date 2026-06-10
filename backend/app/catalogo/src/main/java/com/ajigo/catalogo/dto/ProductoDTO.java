package com.ajigo.catalogo.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductoDTO {
    private Long productoId;
    private String id;               // slug: "pn1", "ec2" — para el frontend
    private String nombreProducto;
    private String descripcion;
    private String imagenUrl;
    private String tag;              // "Café", "Postre", "Bolón"
    private String badgeText;        // "PN", "EC"
    private String category;         // slug del restaurante: "piedra-negra"
    private String restaurant;       // nombre del restaurante: "Piedra Negra"
    private Double precio;
    private Double rating;
    private Integer spicyLevel;
    private Boolean activo;
    private Long sucursalId;
    private Long categoriaId;
    private String nombreCategoria;
}