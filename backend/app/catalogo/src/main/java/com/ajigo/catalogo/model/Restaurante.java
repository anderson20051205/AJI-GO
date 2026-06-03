package com.ajigo.catalogo.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "restaurantes")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Restaurante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long restauranteId;

    @Column(nullable = false)
    private String nombreRestaurante;    // "Piedra Negra", "El Capi", etc.

    @Column(nullable = false)
    private String badgeText;            // "PN", "EC", "CO", "UB"

    private String tagline;              // "Café & Postres Premium"
    private String descripcion;
    private String logoUrl;
    private Double rating;               // 4.9
    private Boolean activo = true;

    @OneToMany(mappedBy = "restaurante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Sucursal> sucursales;
}
