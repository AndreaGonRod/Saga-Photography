package com.photography.saga.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EntryType {
    PHOTOSHOOT("#3498db"), // Azul para la sesión física
    DEADLINE("#e74c3c"),   // Rojo para el vencimiento (plazo)
    TASK("#2ecc71"),       // Verde para tareas generales
    EVENT("#f1c40f");      // Amarillo para eventos externos

    private final String defaultColor; // El color asociado al tipo
}