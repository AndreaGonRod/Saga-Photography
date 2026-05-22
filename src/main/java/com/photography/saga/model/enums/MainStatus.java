package com.photography.saga.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MainStatus {
    PARTIAL, // Sesión pendiente de finalizar
    IN_QUEUE, // Pendiente de edición
    POST_PROCESSING, // En edición
    READY // Finalizado
}
