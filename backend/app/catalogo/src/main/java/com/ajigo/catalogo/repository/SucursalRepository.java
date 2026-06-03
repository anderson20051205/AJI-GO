package com.ajigo.catalogo.repository;

import com.ajigo.catalogo.model.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SucursalRepository extends JpaRepository<Sucursal, Long> {
    List<Sucursal> findByRestaurante_RestauranteIdAndActivoTrue(Long restauranteId);
    List<Sucursal> findByActivoTrue();
}