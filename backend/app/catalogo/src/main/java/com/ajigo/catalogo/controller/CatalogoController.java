package com.ajigo.catalogo.controller;

import com.ajigo.catalogo.dto.*;
import com.ajigo.catalogo.model.Categoria;
import com.ajigo.catalogo.model.Sector;
import com.ajigo.catalogo.service.CatalogoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")   // Permite llamadas desde el frontend React
@Tag(name = "Catálogo", description = "Restaurantes, sucursales, productos y categorías")
public class CatalogoController {

    private final CatalogoService catalogoService;

    // ── Health ───────────────────────────────────────────────────────────────
    @GetMapping("/health")
    @Operation(summary = "Health check")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "catalogo");
    }

    // ── Restaurantes ─────────────────────────────────────────────────────────

    @GetMapping("/restaurantes")
    @Operation(summary = "Listar todos los restaurantes activos")
    public List<RestauranteDTO> listarRestaurantes() {
        return catalogoService.listarRestaurantes();
    }

    @GetMapping("/restaurantes/{id}")
    @Operation(summary = "Obtener restaurante por ID")
    public ResponseEntity<RestauranteDTO> getRestaurante(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(catalogoService.getRestaurante(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/restaurantes")
    @Operation(summary = "Crear restaurante")
    public ResponseEntity<RestauranteDTO> crearRestaurante(
            @Valid @RequestBody CrearRestauranteRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(catalogoService.crearRestaurante(req));
    }

    @PutMapping("/restaurantes/{id}")
    @Operation(summary = "Actualizar restaurante")
    public ResponseEntity<RestauranteDTO> actualizarRestaurante(
            @PathVariable Long id,
            @Valid @RequestBody CrearRestauranteRequest req) {
        try {
            return ResponseEntity.ok(catalogoService.actualizarRestaurante(id, req));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ── Productos ─────────────────────────────────────────────────────────────

    @GetMapping("/restaurantes/{restauranteId}/productos")
    @Operation(summary = "Listar todos los productos de un restaurante")
    public List<ProductoDTO> productosPorRestaurante(@PathVariable Long restauranteId) {
        return catalogoService.listarProductosPorRestaurante(restauranteId);
    }

    @GetMapping("/sucursales/{sucursalId}/productos")
    @Operation(summary = "Listar productos activos de una sucursal")
    public List<ProductoDTO> productosPorSucursal(@PathVariable Long sucursalId) {
        return catalogoService.listarProductosPorSucursal(sucursalId);
    }

    @GetMapping("/productos/buscar")
    @Operation(summary = "Buscar productos por nombre o descripción")
    public List<ProductoDTO> buscarProductos(@RequestParam String q) {
        return catalogoService.buscarProductos(q);
    }

    @GetMapping("/productos/{id}")
    @Operation(summary = "Obtener producto por ID")
    public ResponseEntity<ProductoDTO> getProducto(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(catalogoService.getProducto(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/productos")
    @Operation(summary = "Crear producto")
    public ResponseEntity<ProductoDTO> crearProducto(
            @Valid @RequestBody CrearProductoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(catalogoService.crearProducto(req));
    }

    @PatchMapping("/productos/{id}/stock")
    @Operation(summary = "Actualizar stock de un producto")
    public ResponseEntity<ProductoDTO> actualizarStock(
            @PathVariable Long id,
            @RequestParam Integer cantidad) {
        try {
            return ResponseEntity.ok(catalogoService.actualizarStock(id, cantidad));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ── Categorías ────────────────────────────────────────────────────────────

    @GetMapping("/categorias")
    @Operation(summary = "Listar todas las categorías")
    public List<Categoria> listarCategorias() {
        return catalogoService.listarCategorias();
    }

    // ── Sectores ──────────────────────────────────────────────────────────────

    @GetMapping("/sectores")
    @Operation(summary = "Listar sectores del campus")
    public List<Sector> listarSectores() {
        return catalogoService.listarSectores();
    }
}
