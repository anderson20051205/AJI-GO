package com.ajigo.catalogo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sectores")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Sector {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sectorId;

    @Column(nullable = false)
    private String sectorSTR;  // Ej: "Facultad de Ciencias Técnicas"
}
