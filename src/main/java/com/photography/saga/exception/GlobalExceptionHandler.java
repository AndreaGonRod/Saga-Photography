package com.photography.saga.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. EL DETECTOR DE ERRORES EN EL JSON (Tu problema actual)
    // Este método te dirá exactamente qué campo está mal escrito o tiene un tipo erróneo
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleJsonError(HttpMessageNotReadableException ex) {
        Map<String, Object> response = createBaseResponse(HttpStatus.BAD_REQUEST, "Error de lectura en el JSON");

        String detail = ex.getMostSpecificCause().getMessage();
        // Limpiamos un poco el mensaje para que sea legible
        response.put("details", detail);

        return ResponseEntity.badRequest().body(response);
    }

    // 2. EL VALIDADOR DE CAMPOS (@NotBlank, @NotNull, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, Object> response = createBaseResponse(HttpStatus.BAD_REQUEST, "Error de validación en los campos");

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            fieldErrors.put(fieldName, message);
        });

        response.put("errors", fieldErrors);
        return ResponseEntity.badRequest().body(response);
    }

    // 3. TUS EXCEPCIONES DE NEGOCIO (Las que lanzas con tu ErrorHandler)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessExceptions(ResponseStatusException ex) {
        Map<String, Object> response = createBaseResponse((HttpStatus) ex.getStatusCode(), ex.getReason());
        return ResponseEntity.status(ex.getStatusCode()).body(response);
    }

    // 4. EL "BOTÓN DE PÁNICO" (Errores inesperados del servidor)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex) {
        Map<String, Object> response = createBaseResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Ha ocurrido un error inesperado");
        response.put("debug_message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    // Método auxiliar para mantener la estructura uniforme
    private Map<String, Object> createBaseResponse(HttpStatus status, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", status.value());
        response.put("error", status.getReasonPhrase());
        response.put("message", message);
        return response;
    }
}