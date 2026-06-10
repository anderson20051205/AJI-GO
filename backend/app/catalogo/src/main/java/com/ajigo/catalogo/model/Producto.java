package com.ajigo.catalogo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PRODUCTOS")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProductoID")
    private Long productoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SucursalID", nullable = false)
    private Sucursal sucursal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CategoriaID", nullable = false)
    private Categoria categoria;

    @Column(name = "NombreProducto", nullable = false)
    private String nombreProducto;

    @Column(name = "Descripcion")
    private String descripcion;

    @Column(name = "ImagenURL")
    private String imagenUrl;

    @Column(name = "Precio", nullable = false)
    private Double precio;

    @Column(name = "Stock", nullable = false)
    private Integer stock;

    @Column(name = "Activo", nullable = false)
    private Boolean activo = true;
}
