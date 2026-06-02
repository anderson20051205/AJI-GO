package com.ajigo.catalogo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sucursales")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sucursal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sucursalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restauranteId", nullable = false)
    private Restaurante restaurante;

    private Long sectorId;
    private Long usuarioId;
    private String direccionDesc;
    private String mapaUrl;
    private String telefono;

    @Column(nullable = false)
    private Boolean estaAbierto = true;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(updatable = false)
    private LocalDateTime fechaRegistro;

    @PrePersist
    void prePersist() { this.fechaRegistro = LocalDateTime.now(); }

    @OneToMany(mappedBy = "sucursal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Producto> productos;
}