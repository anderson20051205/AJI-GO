package com.ajigo.catalogo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SECTORES")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Sector {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SectorID")
    private Long sectorId;

    @Column(name = "SectorSTR", nullable = false)
    private String sectorSTR;
}
