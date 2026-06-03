package com.ajigo.catalogo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "productos")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sucursalId", nullable = false)
    private Sucursal sucursal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoriaId", nullable = false)
    private Categoria categoria;

    @Column(nullable = false)
    private String nombreProducto;   // "Espresso Americano Orgánico"

    private String descripcion;
    private String imagenUrl;
    private String tag;              // "Café", "Postre", "Bolón" — para el frontend
    private String badgeText;        // "PN", "EC", "CO", "UB"
    private Double precio;
    private Double rating;
    private Integer stock;
    private Integer spicyLevel = 0;  // 0 = sin picante
    private Boolean activo = true;
}
