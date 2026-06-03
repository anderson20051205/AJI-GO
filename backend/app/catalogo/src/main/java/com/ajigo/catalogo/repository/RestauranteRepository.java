package com.ajigo.catalogo.repository;

import com.ajigo.catalogo.model.Restaurante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RestauranteRepository extends JpaRepository<Restaurante, Long> {
    List<Restaurante> findByActivoTrue();
    Optional<Restaurante> findByBadgeText(String badgeText);
}
