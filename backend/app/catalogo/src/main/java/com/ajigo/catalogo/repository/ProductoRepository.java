package com.ajigo.catalogo.repository;

import com.ajigo.catalogo.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findBySucursal_SucursalIdAndActivoTrue(Long sucursalId);
    List<Producto> findByCategoria_CategoriaIdAndActivoTrue(Long categoriaId);
}
