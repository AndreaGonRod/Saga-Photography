package com.photography.saga.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public interface ErrorHandler {

    default ResponseStatusException notFound() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "El registro solicitado no existe");
    }

    default ResponseStatusException badRequest() {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Faltan campos obligatorios en la solicitud");
    }

    default ResponseStatusException conflict() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un registro con estos datos");
    }

    default ResponseStatusException internalServerError() {
        return new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno al procesar la entidad");
    }

}