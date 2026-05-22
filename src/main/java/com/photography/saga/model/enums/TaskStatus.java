package com.photography.saga.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TaskStatus {
    DESIGN,      // En edición/retoque
    REVIEW,      // Esperando que el cliente confirme
    IN_QUEUE,    // En lista de espera
    RETOUCHING,  // En retoque por cambios solicitados
    LAB,         // En laboratorio externo
    PRODUCTION,  // Producción en el estudio (tu impresora)
    ASSEMBLY,    // Montaje/Enmarcado/Packaging
    READY,       // Terminado para recoger
    DELIVERED    // Ya entregado al cliente
}
