package com.ajigo.catalogo.service;

import com.ajigo.catalogo.dto.*;
import com.ajigo.catalogo.model.*;
import com.ajigo.catalogo.repository.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CatalogoService {

    private final RestauranteRepository restauranteRepo;
    private final SucursalRepository    sucursalRepo;
    private final ProductoRepository    productoRepo;
    private final CategoriaRepository   categoriaRepo;
    private final SectorRepository      sectorRepo;

    // ── Slug helper ──────────────────────────────────────────────────────────
    private String toSlug(String name) {
        return name.toLowerCase()
                   .replaceAll("[áàä]", "a")
                   .replaceAll("[éèë]", "e")
                   .replaceAll("[íìï]", "i")
                   .replaceAll("[óòö]", "o")
                   .replaceAll("[úùü]", "u")
                   .replaceAll("\\s+", "-")
                   .replaceAll("[^a-z0-9-]", "");
    }

    // ── Helpers de datos fijos (campos que no están en la BD) ────────────────
    private String getBadge(String nombre) {
        if (nombre.contains("Piedra"))  return "PN";
        if (nombre.contains("Capi"))    return "EC";
        if (nombre.contains("Collage")) return "CO";
        if (nombre.contains("Bakery"))  return "UB";
        return "??";
    }

    private Double getRating(String nombre) {
        if (nombre.contains("Collage")) return 4.7;
        return 4.9;
    }

    private String getTagline(String nombre) {
        if (nombre.contains("Piedra"))  return "Café & Postres Premium";
        if (nombre.contains("Capi"))    return "Bolones & Tigrillos Auténticos";
        if (nombre.contains("Collage")) return "Mini Market del Campus";
        if (nombre.contains("Bakery"))  return "Panadería & Pastelería Artesanal";
        return "";
    }

    // ── Mappers ──────────────────────────────────────────────────────────────

    private RestauranteDTO toRestauranteDTO(Restaurante r) {
        Sucursal sucursal = sucursalRepo
            .findByRestaurante_RestauranteIdAndActivoTrue(r.getRestauranteId())
            .stream().findFirst().orElse(null);

        return RestauranteDTO.builder()
            .restauranteId(r.getRestauranteId())
            .id(toSlug(r.getNombreRestaurante()))
            .nombreRestaurante(r.getNombreRestaurante())
            .badgeText(getBadge(r.getNombreRestaurante()))
            .tagline(getTagline(r.getNombreRestaurante()))
            .descripcion(r.getDescripcion())
            .logoUrl(r.getLogoUrl())
            .rating(getRating(r.getNombreRestaurante()))
            .activo(r.getActivo())
            .estaAbierto(sucursal != null && Boolean.TRUE.equals(sucursal.getEstaAbierto()))
            .sucursalId(sucursal != null ? sucursal.getSucursalId() : null)
            .build();
    }

    private ProductoDTO toProductoDTO(Producto p) {
        String restauranteName = p.getSucursal().getRestaurante().getNombreRestaurante();
        String badge = getBadge(restauranteName);
        return ProductoDTO.builder()
            .productoId(p.getProductoId())
            .id(badge.toLowerCase() + p.getProductoId())
            .nombreProducto(p.getNombreProducto())
            .descripcion(p.getDescripcion())
            .imagenUrl(p.getImagenUrl())
            .tag(p.getCategoria().getNombreCategoria())
            .badgeText(badge)
            .category(toSlug(restauranteName))
            .restaurant(restauranteName)
            .precio(p.getPrecio())
            .rating(4.8)
            .spicyLevel(0)
            .activo(p.getActivo())
            .sucursalId(p.getSucursal().getSucursalId())
            .categoriaId(p.getCategoria().getCategoriaId())
            .nombreCategoria(p.getCategoria().getNombreCategoria())
            .build();
    }

    // ── Restaurantes ─────────────────────────────────────────────────────────

    public List<RestauranteDTO> listarRestaurantes() {
        return restauranteRepo.findByActivoTrue().stream()
            .map(this::toRestauranteDTO)
            .collect(Collectors.toList());
    }

    public RestauranteDTO getRestaurante(Long id) {
        return restauranteRepo.findById(id)
            .map(this::toRestauranteDTO)
            .orElseThrow(() -> new RuntimeException("Restaurante no encontrado"));
    }

    @Transactional
    public RestauranteDTO crearRestaurante(CrearRestauranteRequest req) {
        Restaurante r = Restaurante.builder()
            .nombreRestaurante(req.getNombreRestaurante())
            .descripcion(req.getDescripcion())
            .logoUrl(req.getLogoUrl())
            .activo(true)
            .build();
        return toRestauranteDTO(restauranteRepo.save(r));
    }

    @Transactional
    public RestauranteDTO actualizarRestaurante(Long id, CrearRestauranteRequest req) {
        Restaurante r = restauranteRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Restaurante no encontrado"));
        r.setNombreRestaurante(req.getNombreRestaurante());
        r.setDescripcion(req.getDescripcion());
        r.setLogoUrl(req.getLogoUrl());
        return toRestauranteDTO(restauranteRepo.save(r));
    }

    // ── Productos ─────────────────────────────────────────────────────────────

    public List<ProductoDTO> listarProductosPorRestaurante(Long restauranteId) {
        return productoRepo.findByRestauranteId(restauranteId).stream()
            .map(this::toProductoDTO)
            .collect(Collectors.toList());
    }

    public List<ProductoDTO> listarProductosPorSucursal(Long sucursalId) {
        return productoRepo.findBySucursal_SucursalIdAndActivoTrue(sucursalId).stream()
            .map(this::toProductoDTO)
            .collect(Collectors.toList());
    }

    public List<ProductoDTO> buscarProductos(String term) {
        return productoRepo.buscar(term).stream()
            .map(this::toProductoDTO)
            .collect(Collectors.toList());
    }

    public ProductoDTO getProducto(Long id) {
        return productoRepo.findById(id)
            .map(this::toProductoDTO)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @Transactional
    public ProductoDTO crearProducto(CrearProductoRequest req) {
        Sucursal sucursal = sucursalRepo.findById(req.getSucursalId())
            .orElseThrow(() -> new RuntimeException("Sucursal no encontrada"));
        Categoria categoria = categoriaRepo.findById(req.getCategoriaId())
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Producto p = Producto.builder()
            .sucursal(sucursal)
            .categoria(categoria)
            .nombreProducto(req.getNombreProducto())
            .descripcion(req.getDescripcion())
            .imagenUrl(req.getImagenUrl())
            .precio(req.getPrecio())
            .stock(req.getStock() != null ? req.getStock() : 0)
            .activo(true)
            .build();
        return toProductoDTO(productoRepo.save(p));
    }

    @Transactional
    public ProductoDTO actualizarStock(Long id, Integer cantidad) {
        Producto p = productoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        p.setStock(cantidad);
        return toProductoDTO(productoRepo.save(p));
    }

    // ── Categorías ───────────────────────────────────────────────────────────

    public List<Categoria> listarCategorias() {
        return categoriaRepo.findAll();
    }

    // ── Sectores ─────────────────────────────────────────────────────────────

    public List<Sector> listarSectores() {
        return sectorRepo.findAll();
    }

    // ── Seed de datos ─────────────────────────────────────────────────────────

    @PostConstruct
    @Transactional
    public void seedData() {
        if (!restauranteRepo.findAll().isEmpty()) {
            log.info("Catálogo ya tiene datos — omitiendo seed.");
            return;
        }
        log.info("Iniciando seed de catálogo...");

        // ── Sectores UIDE ──
        Sector s1 = sectorRepo.save(Sector.builder().sectorSTR("Facultad de Ciencias Técnicas").build());
        Sector s2 = sectorRepo.save(Sector.builder().sectorSTR("Facultad de Medicina").build());
        Sector s3 = sectorRepo.save(Sector.builder().sectorSTR("Facultad Administrativa").build());
        Sector s4 = sectorRepo.save(Sector.builder().sectorSTR("Edificio de Aulas").build());

        // ── Categorías ──
        Categoria catCafe     = categoriaRepo.save(Categoria.builder().nombreCategoria("Café").build());
        Categoria catPostre   = categoriaRepo.save(Categoria.builder().nombreCategoria("Postre").build());
        Categoria catBolon    = categoriaRepo.save(Categoria.builder().nombreCategoria("Bolón").build());
        Categoria catBebida   = categoriaRepo.save(Categoria.builder().nombreCategoria("Bebida").build());
        Categoria catMercado  = categoriaRepo.save(Categoria.builder().nombreCategoria("Mini Market").build());
        Categoria catPan      = categoriaRepo.save(Categoria.builder().nombreCategoria("Panadería").build());
        Categoria catTigrillo = categoriaRepo.save(Categoria.builder().nombreCategoria("Tigrillo").build());
        Categoria catBebFria  = categoriaRepo.save(Categoria.builder().nombreCategoria("Bebida Fría").build());
        Categoria catDulce    = categoriaRepo.save(Categoria.builder().nombreCategoria("Dulce").build());

        // ── PIEDRA NEGRA ──
        Restaurante piedra = restauranteRepo.save(Restaurante.builder()
            .nombreRestaurante("Piedra Negra")
            .descripcion("Cafetería artesanal de especialidad con los mejores granos de origen nacional.")
            .activo(true).build());

        Sucursal spn = sucursalRepo.save(Sucursal.builder()
            .restaurante(piedra).sectorId(s1.getSectorId())
            .direccionDesc("Campus UIDE - Planta Baja, Bloque A")
            .estaAbierto(true).activo(true).build());

        seedProducto(spn, catCafe,    "Espresso Americano Orgánico",   "Extracción doble de café de especialidad 100% arábica de origen nacional.", 6.50);
        seedProducto(spn, catCafe,    "Cappuccino con Arte Latte",      "Doble espresso con leche texturizada al vapor y cacao orgánico.", 8.50);
        seedProducto(spn, catBebFria, "Café Latte Helado con Vainilla", "Espresso doble con leche fría y jarabe de vainilla artesanal.", 9.50);
        seedProducto(spn, catPostre,  "Torta de Chocolate Extrahúmeda", "Bizcocho húmedo con cacao al 70% y fudge de chocolate.", 12.00);
        seedProducto(spn, catPostre,  "Pie de Limón Clásico",           "Base de galleta con crema de limón y merengue italiano.", 10.00);

        // ── EL CAPI ──
        Restaurante capi = restauranteRepo.save(Restaurante.builder()
            .nombreRestaurante("El Capi")
            .descripcion("La tradición manabita en el campus. Los mejores bolones de verde artesanales.")
            .activo(true).build());

        Sucursal sec = sucursalRepo.save(Sucursal.builder()
            .restaurante(capi).sectorId(s1.getSectorId())
            .direccionDesc("Campus UIDE - Patio Central")
            .estaAbierto(true).activo(true).build());

        seedProducto(sec, catBolon,    "Bolón de Queso Criollo",        "Masa de plátano verde con queso fresco criollo fundido.", 8.00);
        seedProducto(sec, catBolon,    "Bolón de Chicharrón Crujiente", "Masa de verde con trozos crocantes de chicharrón premium.", 9.50);
        seedProducto(sec, catBolon,    "Bolón Mixto Especial",          "Queso fresco criollo y chicharrón en masa de verde.", 11.00);
        seedProducto(sec, catTigrillo, "Tigrillo Tradicional con Huevo","Verde majado con huevo, queso, chicharrón y culantro.", 12.50);

        // ── COLLAGE ──
        Restaurante collage = restauranteRepo.save(Restaurante.builder()
            .nombreRestaurante("Collage")
            .descripcion("Tu tienda de conveniencia universitaria. Snacks, bebidas y más.")
            .activo(true).build());

        Sucursal sco = sucursalRepo.save(Sucursal.builder()
            .restaurante(collage).sectorId(s4.getSectorId())
            .direccionDesc("Campus UIDE - Edificio de Aulas Planta Baja")
            .estaAbierto(true).activo(true).build());

        seedProducto(sco, catMercado, "Papas Fritas Lays Clásicas",   "Bolsa familiar 150g de papas fritas saladas.", 6.00);
        seedProducto(sco, catBebida,  "Bebida Energizante Red Bull",  "Lata 250ml para recargar energía en clases.", 8.50);
        seedProducto(sco, catDulce,   "Chocolate Toblerone",          "Barra 100g de chocolate suizo con turrón.", 7.50);
        seedProducto(sco, catBebida,  "Agua Mineral Güitig con Gas",  "Botella 500ml de agua mineral gasificada.", 2.50);

        // ── UIDE BAKERY ──
        Restaurante bakery = restauranteRepo.save(Restaurante.builder()
            .nombreRestaurante("UIDE Bakery")
            .descripcion("Panes y postres horneados diariamente con ingredientes frescos de primera calidad.")
            .activo(true).build());

        Sucursal sub = sucursalRepo.save(Sucursal.builder()
            .restaurante(bakery).sectorId(s3.getSectorId())
            .direccionDesc("Campus UIDE - Facultad Administrativa, Local 3")
            .estaAbierto(true).activo(true).build());

        seedProducto(sub, catPan,    "Croissant Hojaldrado Francés", "Croissant artesanal con 100% mantequilla pura.", 5.00);
        seedProducto(sub, catPan,    "Cinnamon Roll con Glaseado",   "Rollo de canela con glaseado de queso crema.", 6.50);
        seedProducto(sub, catPostre, "Cheesecake de Frutos Rojos",   "Queso crema con compota artesanal de frutos rojos.", 11.00);
        seedProducto(sub, catPan,    "Pan de Yuca Ecuatoriano",      "Pan tradicional de harina de yuca y queso fresco.", 3.50);

        log.info("✓ Seed completado — 4 restaurantes y 17 productos cargados.");
    }

    private void seedProducto(Sucursal suc, Categoria cat,
                               String nombre, String desc, Double precio) {
        productoRepo.save(Producto.builder()
            .sucursal(suc)
            .categoria(cat)
            .nombreProducto(nombre)
            .descripcion(desc)
            .precio(precio)
            .stock(100)
            .activo(true)
            .build());
    }
}