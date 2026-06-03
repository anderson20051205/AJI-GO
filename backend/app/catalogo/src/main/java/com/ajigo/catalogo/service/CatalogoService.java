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
import java.util.Map;
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
    // Convierte "Piedra Negra" → "piedra-negra" (igual al frontend)
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

    // ── Mappers ──────────────────────────────────────────────────────────────

    private RestauranteDTO toRestauranteDTO(Restaurante r) {
        Sucursal sucursal = sucursalRepo
            .findByRestaurante_RestauranteIdAndActivoTrue(r.getRestauranteId())
            .stream().findFirst().orElse(null);

        return RestauranteDTO.builder()
            .restauranteId(r.getRestauranteId())
            .id(toSlug(r.getNombreRestaurante()))
            .nombreRestaurante(r.getNombreRestaurante())
            .badgeText(r.getBadgeText())
            .tagline(r.getTagline())
            .descripcion(r.getDescripcion())
            .logoUrl(r.getLogoUrl())
            .rating(r.getRating())
            .activo(r.getActivo())
            .estaAbierto(sucursal != null && Boolean.TRUE.equals(sucursal.getEstaAbierto()))
            .sucursalId(sucursal != null ? sucursal.getSucursalId() : null)
            .build();
    }

    private ProductoDTO toProductoDTO(Producto p) {
        String restauranteName = p.getSucursal().getRestaurante().getNombreRestaurante();
        return ProductoDTO.builder()
            .productoId(p.getProductoId())
            .id(p.getBadgeText() != null
                ? p.getBadgeText().toLowerCase() + p.getProductoId()
                : String.valueOf(p.getProductoId()))
            .nombreProducto(p.getNombreProducto())
            .descripcion(p.getDescripcion())
            .imagenUrl(p.getImagenUrl())
            .tag(p.getTag())
            .badgeText(p.getBadgeText())
            .category(toSlug(restauranteName))
            .restaurant(restauranteName)
            .precio(p.getPrecio())
            .rating(p.getRating())
            .spicyLevel(p.getSpicyLevel())
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
            .badgeText(req.getBadgeText())
            .tagline(req.getTagline())
            .descripcion(req.getDescripcion())
            .logoUrl(req.getLogoUrl())
            .rating(req.getRating())
            .activo(true)
            .build();
        return toRestauranteDTO(restauranteRepo.save(r));
    }

    @Transactional
    public RestauranteDTO actualizarRestaurante(Long id, CrearRestauranteRequest req) {
        Restaurante r = restauranteRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Restaurante no encontrado"));
        r.setNombreRestaurante(req.getNombreRestaurante());
        r.setBadgeText(req.getBadgeText());
        r.setTagline(req.getTagline());
        r.setDescripcion(req.getDescripcion());
        r.setLogoUrl(req.getLogoUrl());
        if (req.getRating() != null) r.setRating(req.getRating());
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
            .rating(req.getRating())
            .stock(req.getStock())
            .spicyLevel(req.getSpicyLevel())
            .tag(req.getTag())
            .badgeText(req.getBadgeText())
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
    // Carga los 4 restaurantes y todos sus platos del frontend si la BD está vacía

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
        Categoria catCafe   = categoriaRepo.save(Categoria.builder().nombreCategoria("Café").build());
        Categoria catPostre = categoriaRepo.save(Categoria.builder().nombreCategoria("Postre").build());
        Categoria catBolon  = categoriaRepo.save(Categoria.builder().nombreCategoria("Bolón").build());
        Categoria catBebida = categoriaRepo.save(Categoria.builder().nombreCategoria("Bebida").build());
        Categoria catMercado = categoriaRepo.save(Categoria.builder().nombreCategoria("Mini Market").build());
        Categoria catPan    = categoriaRepo.save(Categoria.builder().nombreCategoria("Panadería").build());
        Categoria catTigrillo = categoriaRepo.save(Categoria.builder().nombreCategoria("Tigrillo").build());
        Categoria catBebFria = categoriaRepo.save(Categoria.builder().nombreCategoria("Bebida Fría").build());
        Categoria catDulce  = categoriaRepo.save(Categoria.builder().nombreCategoria("Dulce").build());

        // ─────────────────────────────────────────────────────────────────────
        // PIEDRA NEGRA
        // ─────────────────────────────────────────────────────────────────────
        Restaurante piedra = restauranteRepo.save(Restaurante.builder()
            .nombreRestaurante("Piedra Negra")
            .badgeText("PN")
            .tagline("Café & Postres Premium")
            .descripcion("Cafetería artesanal de especialidad con los mejores granos de origen nacional. Ambiente acogedor para estudiar y disfrutar.")
            .rating(4.9)
            .activo(true)
            .build());

        Sucursal spn = sucursalRepo.save(Sucursal.builder()
            .restaurante(piedra)
            .sectorId(s1.getSectorId())
            .direccionDesc("Campus UIDE - Planta Baja, Bloque A")
            .estaAbierto(true)
            .activo(true)
            .build());

        seedProducto(spn, catCafe,   "Espresso Americano Orgánico",   "Extracción doble de café de especialidad 100% arábica de origen nacional, servido con agua caliente filtrada.", 6.50,  4.9, "PN");
        seedProducto(spn, catCafe,   "Cappuccino con Arte Latte",      "Doble espresso combinado con leche texturizada al vapor, creando una crema densa y dulce. Espolvoreado con cacao orgánico.", 8.50, 4.8, "PN");
        seedProducto(spn, catBebFria,"Café Latte Helado con Vainilla", "Espresso doble servido sobre leche fría, jarabe de vainilla artesanal y cubos de hielo.", 9.50, 4.7, "PN");
        seedProducto(spn, catPostre, "Torta de Chocolate Extrahúmeda", "Bizcocho húmedo artesanal con cacao al 70%, relleno y cubierto de abundante fudge de chocolate caliente de la casa.", 12.00, 4.9, "PN");
        seedProducto(spn, catPostre, "Pie de Limón Clásico",           "Base crocante de galleta de vainilla rellena con crema de limón y coronada con merengue italiano sopleteado.", 10.00, 4.8, "PN");

        // ─────────────────────────────────────────────────────────────────────
        // EL CAPI
        // ─────────────────────────────────────────────────────────────────────
        Restaurante capi = restauranteRepo.save(Restaurante.builder()
            .nombreRestaurante("El Capi")
            .badgeText("EC")
            .tagline("Bolones & Tigrillos Auténticos")
            .descripcion("La tradición manabita en el campus. Los mejores bolones de verde con recetas artesanales transmitidas de generación en generación.")
            .rating(4.9)
            .activo(true)
            .build());

        Sucursal sec = sucursalRepo.save(Sucursal.builder()
            .restaurante(capi)
            .sectorId(s1.getSectorId())
            .direccionDesc("Campus UIDE - Patio Central")
            .estaAbierto(true)
            .activo(true)
            .build());

        seedProducto(sec, catBolon,   "Bolón de Queso Criollo",         "Masa crujiente de plátano verde frito majado y sazonado, relleno con abundante queso fresco criollo fundido.", 8.00,  4.9, "EC");
        seedProducto(sec, catBolon,   "Bolón de Chicharrón Crujiente",  "Masa de plátano verde frito majada con trozos crocantes de chicharrón de cerdo premium seleccionados.", 9.50,  4.9, "EC");
        seedProducto(sec, catBolon,   "Bolón Mixto Especial",           "La combinación perfecta de masa de verde majado rellena de queso fresco criollo y trozos crocantes de chicharrón.", 11.00, 4.8, "EC");
        seedProducto(sec, catTigrillo,"Tigrillo Tradicional con Huevo", "Plátano verde majado y sofrito en sartén con huevo revuelto, queso criollo, trozos de chicharrón y culantro fresco.", 12.50, 4.8, "EC");

        // ─────────────────────────────────────────────────────────────────────
        // COLLAGE
        // ─────────────────────────────────────────────────────────────────────
        Restaurante collage = restauranteRepo.save(Restaurante.builder()
            .nombreRestaurante("Collage")
            .badgeText("CO")
            .tagline("Mini Market del Campus")
            .descripcion("Tu tienda de conveniencia universitaria. Snacks, bebidas, útiles y todo lo que necesitas entre clases sin salir del campus.")
            .rating(4.7)
            .activo(true)
            .build());

        Sucursal sco = sucursalRepo.save(Sucursal.builder()
            .restaurante(collage)
            .sectorId(s4.getSectorId())
            .direccionDesc("Campus UIDE - Edificio de Aulas Planta Baja")
            .estaAbierto(true)
            .activo(true)
            .build());

        seedProducto(sco, catMercado,"Papas Fritas Lays Clásicas",      "Bolsa tamaño familiar (150g) de papas fritas clásicas saladas. Ideales para compartir entre clases.", 6.00,  4.7, "CO");
        seedProducto(sco, catBebida, "Bebida Energizante Red Bull",     "Lata de 250ml de la clásica bebida energizante fría para recargar energía durante las horas de estudio.", 8.50,  4.8, "CO");
        seedProducto(sco, catDulce,  "Chocolate de Leche Toblerone",    "Barra de chocolate de leche suizo con turrón de miel y almendras de 100g.", 7.50,  4.9, "CO");
        seedProducto(sco, catBebida, "Agua Mineral Güitig con Gas",     "Botella de 500ml de agua mineral gasificada naturalmente, bien helada.", 2.50,  4.6, "CO");

        // ─────────────────────────────────────────────────────────────────────
        // UIDE BAKERY
        // ─────────────────────────────────────────────────────────────────────
        Restaurante bakery = restauranteRepo.save(Restaurante.builder()
            .nombreRestaurante("UIDE Bakery")
            .badgeText("UB")
            .tagline("Panadería & Pastelería Artesanal")
            .descripcion("Panes y postres horneados diariamente con ingredientes frescos de primera calidad. El aroma del campus.")
            .rating(4.9)
            .activo(true)
            .build());

        Sucursal sub = sucursalRepo.save(Sucursal.builder()
            .restaurante(bakery)
            .sectorId(s3.getSectorId())
            .direccionDesc("Campus UIDE - Facultad Administrativa, Local 3")
            .estaAbierto(true)
            .activo(true)
            .build());

        seedProducto(sub, catPan,    "Croissant Hojaldrado Francés",   "Croissant artesanal elaborado con 100% mantequilla pura, horneado diariamente.", 5.00,  4.9, "UB");
        seedProducto(sub, catPan,    "Cinnamon Roll con Glaseado",     "Rollo de canela horneado, suave y esponjoso, cubierto con glaseado dulce de queso crema.", 6.50,  4.8, "UB");
        seedProducto(sub, catPostre, "Cheesecake de Frutos Rojos",     "Base de galleta mantequillada con relleno cremoso de queso y capa de compota artesanal de frutos rojos.", 11.00, 4.9, "UB");
        seedProducto(sub, catPan,    "Pan de Yuca Ecuatoriano",        "Pan tradicional ecuatoriano elaborado con harina de yuca y queso fresco.", 3.50,  4.7, "UB");

        log.info("✓ Seed de catálogo completado — 4 restaurantes y 17 productos cargados.");
    }

    private void seedProducto(Sucursal suc, Categoria cat, String nombre,
                               String desc, Double precio, Double rating, String badge) {
        productoRepo.save(Producto.builder()
            .sucursal(suc)
            .categoria(cat)
            .nombreProducto(nombre)
            .descripcion(desc)
            .precio(precio)
            .rating(rating)
            .stock(100)
            .spicyLevel(0)
            .tag(cat.getNombreCategoria())
            .badgeText(badge)
            .activo(true)
            .build());
    }
}
