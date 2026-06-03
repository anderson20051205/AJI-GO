package com.ajigo.catalogo.repository;

import com.ajigo.catalogo.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Todos los productos activos de una sucursal
    List<Producto> findBySucursal_SucursalIdAndActivoTrue(Long sucursalId);

    // Todos los productos activos de un restaurante (via sucursal)
    @Query("SELECT p FROM Producto p WHERE p.sucursal.restaurante.restauranteId = :restauranteId AND p.activo = true")
    List<Producto> findByRestauranteId(@Param("restauranteId") Long restauranteId);

    // Búsqueda por nombre o descripción (para el buscador del frontend)
    @Query("SELECT p FROM Producto p WHERE p.activo = true AND " +
           "(LOWER(p.nombreProducto) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :term, '%')))")
    List<Producto> buscar(@Param("term") String term);

    // Por categoría
    List<Producto> findByCategoria_CategoriaIdAndActivoTrue(Long categoriaId);
}
