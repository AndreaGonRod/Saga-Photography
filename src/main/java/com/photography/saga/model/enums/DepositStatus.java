package com.photography.saga.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DepositStatus {
    AWAITING_DEPOSIT, // Ficha rellena pero sin pago de reserva
    CONFIRMED // Depósito recibido, fecha bloqueada oficialmente
}