package com.photography.saga.service;

import com.photography.saga.dto.response.EventResponse;
import com.photography.saga.dto.response.PhotoshootResponse;
import com.photography.saga.dto.response.CalendarResponse;
import com.photography.saga.dto.response.TaskResponse;
import com.photography.saga.model.enums.EntryType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class CalendarService {

    private final PhotoshootService photoshootService;
    private final EventService eventService;
    private final TaskService taskService;

    public List<CalendarResponse> getAllSchedule() {
        List<CalendarResponse> schedule = new ArrayList<>();

        // 1. Fotos: Trae solo sesiones puras (gracias al filtro TYPE del repo)
        List<PhotoshootResponse> photoshoots = photoshootService.findAll();
        schedule.addAll(photoshoots.stream().map(this::mapPhotoshootToEntry).toList());

        // 2. Deadlines: Solo de las sesiones puras
        schedule.addAll(photoshoots.stream().map(this::mapDeadlineToEntry).toList());

        // 3. Eventos: Trae solo eventos (Bodas/Comuniones)
        schedule.addAll(eventService.findAll().stream().map(this::mapEventToEntry).toList());

        // 4. Tareas
        schedule.addAll(taskService.findAll().stream().map(this::mapTaskToEntry).toList());

        return schedule;
    }

    public List<CalendarResponse> getScheduleRange(LocalDate start, LocalDate end) {
        List<CalendarResponse> schedule = new ArrayList<>();

        // 1. Photoshoots (Azul)
        schedule.addAll(photoshootService.findByDateBetween(start, end).stream()
                .map(this::mapPhotoshootToEntry).toList());

        // 2. Deadlines (Rojo)
        schedule.addAll(photoshootService.findByDueDateBetween(start, end).stream()
                .map(this::mapDeadlineToEntry).toList());

        // 3. Events (Amarillo)
        schedule.addAll(eventService.findByDateBetween(start, end).stream()
                .map(this::mapEventToEntry).toList());

        // 4. Tasks (Verde) - AHORA YA FUNCIONA
        schedule.addAll(taskService.findByDueDateBetween(start, end).stream()
                .map(this::mapTaskToEntry).toList());

        return schedule;
    }

    private CalendarResponse mapPhotoshootToEntry(PhotoshootResponse res) {
        String clientName = res.clients().isEmpty() ? "Sin cliente" :
                res.clients().getFirst().name() + " " + res.clients().getFirst().lastName();

        // Blindaje: Si el status es null, ponemos "SIN_ESTADO"
        String statusName = (res.status() != null) ? res.status().name() : "PENDING";

        return new CalendarResponse(
                res.id(),
                EntryType.PHOTOSHOOT.name(),
                res.title() + " - " + clientName,
                res.date().atTime(res.startTime()),
                res.date().atTime(res.endTime()),
                statusName,
                null
        );
    }

    // Ejemplo para los Deadlines de las sesiones
    private CalendarResponse mapDeadlineToEntry(PhotoshootResponse res) {
        return new CalendarResponse(
                res.id(),
                "DEADLINE",
                "ENTREGA: " + res.title(),
                res.dueDate().atStartOfDay(),
                res.dueDate().atTime(23, 59),
                res.status().name(),
                null
        );
    }

    private CalendarResponse mapEventToEntry(EventResponse res) {
        String clientName = res.clients().isEmpty() ? "Sin cliente" :
                res.clients().getFirst().name() + " " + res.clients().getFirst().lastName();

        // Blindaje: Si el status es null, ponemos "SIN_ESTADO"
        String statusName = (res.status() != null) ? res.status().name() : "PENDING";

        return new CalendarResponse(
                res.id(),
                EntryType.EVENT.name(),
                "EVENTO: " + res.title() + " - " + clientName,
                res.date().atTime(res.startTime()),
                res.date().atTime(res.endTime()),
                statusName,
                null
        );
    }

    private CalendarResponse mapTaskToEntry(TaskResponse res) {
        String clientName = res.client().name() + " " + res.client().lastName();
        // Tomamos el status del primer item de la tarea como referencia
        String taskStatus = res.itemList().isEmpty() ? "PENDING" :
                res.itemList().getFirst().status().name();

        return new CalendarResponse(
                res.id(),
                "TASK",
                "TAREA: " + clientName,
                res.dueDate().atStartOfDay(), // 00:00
                res.dueDate().atTime(23, 59), // 23:59
                null,
                taskStatus
        );
    }

}

