//package com.photography.saga.service;
//
//import com.photography.saga.model.*;
//import org.springframework.stereotype.Service;
//
//import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//
//@Service
//public class CommunicationService {
//
//    public String sendWhatsapp(
//            Person receiver,
//            Staff sender,
//            String additionalMessage,
//            Photoshoot photoshoot,
//            Event event) {
//
//        StringBuilder message = new StringBuilder();
//        message.append("Hola ").append(receiver.getName());
//
//        // --- Lógica para Clientes ---
//        if (receiver instanceof Client client) {
//
//            if (!client.isWelcomeSent()) {
//
//                if (photoshoot != null) {
//                    message.append(". ")
//                            .append(client.getBusiness().getName())
//                            .append(" te recuerda la sesión de fotos programada para mañana, ")
//                            .append(photoshoot.getDate())
//                            .append(" a las ")
//                            .append(photoshoot.getStartTime())
//                            .append(".\n")
//                            .append("Quedamos a tu disposición.\n");
//
//                } else if (event != null && event.getDeposit().isPaid()) {
//                    message.append(". Gracias por confiar en ")
//                            .append(client.getBusiness().getName())
//                            .append(".\nSe ha reservado el día ")
//                            .append(event.getDate())
//                            .append(" para el reportaje de ")
//                            .append(event.getJobType())
//                            .append(".\n");
//                }
//
//                client.setWelcomeSent(true);
//
//            } else {
//                if (sender != null) {
//                    message.append(", soy ").append(sender.getName());
//                    if (client.getBusiness() != null) {
//                        message.append(" de ").append(client.getBusiness().getName());
//                    }
//                    message.append(". ");
//                }
//
//                if (additionalMessage != null && !additionalMessage.isBlank()) {
//                    message.append(additionalMessage).append(" ");
//                }
//            }
//        }
//
//        // --- Lógica para Staff ---
//        if (receiver instanceof Staff staff) {
//
//            if (event != null) {
//                message.append("¿Tendrías disponibilidad para realizar este trabajo?\n")
//                        .append(event.getTitle())
//                        .append("\nDía: ").append(event.getDate())
//                        .append("\nHora: ").append(event.getStartTime())
//                        .append("\nLugar de la ceremonia: ").append(event.getLocation().getCeremony())
//                        .append("\nLugar del restaurante: ").append(event.getLocation().getRestaurant());
//            }
//
//            if (additionalMessage != null && !additionalMessage.isBlank()) {
//                message.append(additionalMessage).append(" ");
//            }
//        }
//
//        message.append("¡Un saludo!");
//
//        // Codificación UTF-8 para WhatsApp
//        String encodedMessage = URLEncoder.encode(message.toString(), StandardCharsets.UTF_8);
//
//        return "https://api.whatsapp.com/send?phone=" + receiver.getPhone() + "&text=" + encodedMessage;
//    }
//}
