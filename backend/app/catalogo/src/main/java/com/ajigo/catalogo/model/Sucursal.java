package com.ajigo.catalogo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "SUCURSALES")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Sucursal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SucursalID")
    private Long sucursalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RestauranteID", nullable = false)
    private Restaurante restaurante;

    @Column(name = "SectorID")
    private Long sectorId;

    @Column(name = "UsuarioID")
    private Long usuarioId;

    @Column(name = "DireccionDesc")
    private String direccionDesc;

    @Column(name = "MapaURL")
    private String mapaUrl;

    @Column(name = "Telefono")
    private String telefono;

    @Column(name = "EstaAbierto")
    private Boolean estaAbierto = true;

    @Column(name = "Activo")
    private Boolean activo = true;

    @Column(name = "FechaRegistro", updatable = false)
    private LocalDateTime fechaRegistro;

    @PrePersist
    void prePersist() { this.fechaRegistro = LocalDateTime.now(); }

    @OneToMany(mappedBy = "sucursal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Producto> productos;
}
