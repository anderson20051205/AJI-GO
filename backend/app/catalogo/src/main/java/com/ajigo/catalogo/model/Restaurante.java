package com.ajigo.catalogo.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "RESTAURANTES")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Restaurante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RestauranteID")
    private Long restauranteId;

    @Column(name = "NombreRestaurante", nullable = false)
    private String nombreRestaurante;

    @Column(name = "LogoURL")
    private String logoUrl;

    @Column(name = "Descripcion")
    private String descripcion;

    @Column(name = "Activo", nullable = false)
    private Boolean activo = true;

    @OneToMany(mappedBy = "restaurante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Sucursal> sucursales;
}
