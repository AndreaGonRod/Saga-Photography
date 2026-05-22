package com.photography.saga.util;

import com.google.i18n.phonenumbers.PhoneNumberUtil;

public class TextFormatter {

    private static final PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();

//    public static String phoneFormatter(String rawPhone) throws NumberParseException {
//        // Uso directo de la constante phoneUtil y los imports existentes
//        Phonenumber.PhoneNumber parsed = phoneUtil.parse(rawPhone, "ES");
//
//        if (!phoneUtil.isValidNumber(parsed)) {
//            throw new NumberParseException(
//                    NumberParseException.ErrorType.NOT_A_NUMBER,
//                    "Número de teléfono no válido"
//            );
//        }
//
//        return phoneUtil.format(parsed, PhoneNumberUtil.PhoneNumberFormat.E164)
//                .replace("+", "");
//    }

    public static String phoneFormatter(String rawPhone) {
        if (rawPhone == null || rawPhone.isBlank()) {
            return null;
        }

        // 1. Limpieza total de caracteres no numéricos
        String cleaned = rawPhone.replaceAll("[^0-9]", "");

        // 2. Si venía con 00, ya lo hemos convertido a dígitos puros (ej: 0034 -> 34)
        // Pero si el usuario escribió "0034...", al quitar el 00 queda el 34.
        if (rawPhone.trim().startsWith("00")) {
            cleaned = cleaned.substring(2);
        }
        // 3. Si el usuario escribió "+34...", el "+" ya voló en el replaceAll.

        // 4. CASO ESPECIAL: Si solo hay 9 dígitos, le ponemos el 34 de España
        if (cleaned.length() == 9) {
            cleaned = "34" + cleaned;
        }

        return cleaned;
    }

    public static String textFormatter(String searchText) {
        if (searchText == null || searchText.isBlank()) {
            return "";
        }

        // 1. Normalizar (quitar tildes y eñes)
        String normalized = java.text.Normalizer.normalize(searchText, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

        // 2. Limpiar espacios, pasar a mayúsculas y quitar bordes
        return normalized.toUpperCase()
                .replaceAll("\\s+", " ")
                .trim();
    }
}
