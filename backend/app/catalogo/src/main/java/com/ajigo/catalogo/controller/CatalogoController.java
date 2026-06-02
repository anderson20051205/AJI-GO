package com.ajigo.catalogo.controller;

import com.ajigo.catalogo.model.*;
import com.ajigo.catalogo.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Catálogo", description = "Restaurantes, sucursales y productos")
public class CatalogoController {

    private final RestauranteRepository restauranteRepo;
    private final ProductoRepository    productoRepo;

    // ── Health ───────────────────────────────────────────────────────────────
    @GetMapping("/health")
    @Operation(summary = "Health check del servicio")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "catalogo");
    }

    // ── Restaurantes ─────────────────────────────────────────────────────────
    @GetMapping("/restaurantes")
    @Operation(summary = "Listar restaurantes activos")
    public List<Restaurante> listarRestaurantes() {
        return restauranteRepo.findByActivoTrue();
    }

    @GetMapping("/restaurantes/{id}")
    @Operation(summary = "Obtener restaurante por ID")
    public ResponseEntity<Restaurante> getRestaurante(@PathVariable Long id) {
        return restauranteRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/restaurantes")
    @Operation(summary = "Crear restaurante")
    public ResponseEntity<Restaurante> crearRestaurante(@RequestBody Restaurante restaurante) {
        restaurante.setActivo(true);
        return ResponseEntity.status(HttpStatus.CREATED).body(restauranteRepo.save(restaurante));
    }

    @PutMapping("/restaurantes/{id}")
    @Operation(summary = "Actualizar restaurante")
    public ResponseEntity<Restaurante> actualizarRestaurante(
            @PathVariable Long id, @RequestBody Restaurante datos) {
        return restauranteRepo.findById(id).map(r -> {
            r.setNombreRestaurante(datos.getNombreRestaurante());
            r.setDescripcion(datos.getDescripcion());
            r.setLogoUrl(datos.getLogoUrl());
            return ResponseEntity.ok(restauranteRepo.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Productos ─────────────────────────────────────────────────────────────
    @GetMapping("/sucursales/{sucursalId}/productos")
    @Operation(summary = "Listar productos activos de una sucursal")
    public List<Producto> productosPorSucursal(@PathVariable Long sucursalId) {
        return productoRepo.findBySucursal_SucursalIdAndActivoTrue(sucursalId);
    }

    @GetMapping("/productos/{id}")
    @Operation(summary = "Obtener producto por ID")
    public ResponseEntity<Producto> getProducto(@PathVariable Long id) {
        return productoRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/productos")
    @Operation(summary = "Crear producto")
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        producto.setActivo(true);
        return ResponseEntity.status(HttpStatus.CREATED).body(productoRepo.save(producto));
    }

    @PatchMapping("/productos/{id}/stock")
    @Operation(summary = "Actualizar stock de un producto")
    public ResponseEntity<Producto> actualizarStock(
            @PathVariable Long id, @RequestParam Integer cantidad) {
        return productoRepo.findById(id).map(p -> {
            p.setStock(cantidad);
            return ResponseEntity.ok(productoRepo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }
}
