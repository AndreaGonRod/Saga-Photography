package com.photography.saga.controller;

import com.photography.saga.dto.response.*;
import com.photography.saga.model.*;
import org.springframework.stereotype.Component;

@Component
public class ResponseMapper {

    public OfferResponse toResponse(Offer offer) {
        if (offer == null)
            return null;
        return new OfferResponse(
                offer.getId(),
                offer.getCategory(),
                offer.getSubCategory(),
                offer.getDetails(),
                offer.getPrice(),
                offer.getDefaultTurnAround());
    }

    public ClientResponse toResponse(Client client) {
        if (client == null)
            return null;
        return new ClientResponse(
                client.getId(),
                client.getName(),
                client.getLastName(),
                client.getPhone(),
                client.getEmail(),
                client.getInstagramAccounts(),
                client.getNotes());
    }

    public StaffResponse toResponse(Staff staff) {
        if (staff == null)
            return null;
        return new StaffResponse(
                staff.getId(),
                staff.getName(),
                staff.getLastName(),
                staff.getPhone(),
                staff.getEmail(),
                staff.getNotes());
    }

    public AppointmentResponse toResponse(Appointment appointment) {
        if (appointment == null)
            return null;
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getTitle(),
                appointment.getDate(),
                appointment.getStartTime(),
                appointment.getEndTime(),
                appointment.getCreatedAt(),
                appointment.getUpdatedAt());
    }

    public PhotoshootResponse toResponse(Photoshoot photoshoot) {
        if (photoshoot == null)
            return null;
        return new PhotoshootResponse(
                photoshoot.getId(),
                photoshoot.getTitle(),
                photoshoot.getDate(),
                photoshoot.getStartTime(),
                photoshoot.getEndTime(),
                photoshoot.getEventDate(),

                photoshoot.getClientsList().stream().map(this::toResponse).toList(),
                toResponse(photoshoot.getOffer()),
                photoshoot.getFinalPrice(),

                photoshoot.getStatus(),
                photoshoot.getDueDate(),
                photoshoot.getCustomTurnAround(),
                photoshoot.isCommercialUsageAuthorized(),
                photoshoot.getFolderPath(),

                photoshoot.getNotes(),
                photoshoot.getCreatedAt(),
                photoshoot.getUpdatedAt());
    }

    public EventResponse toResponse(Event event) {
        if (event == null)
            return null;

        return new EventResponse(
                // 1. Identificación, Tiempos e IDs
                event.getId(),
                event.getTitle(),
                event.getDate(),
                event.getStartTime(),
                event.getEndTime(),
                event.isFullDay(),

                event.getClientsList().stream().map(this::toResponse).toList(),
                toResponse(event.getOffer()),
                event.getFinalPrice(),
                event.getDeposit(),

                event.getStatus(),
                event.getDueDate(),
                event.getCustomTurnAround(),
                event.getStaffList().stream().map(this::toResponse).toList(),
                event.isCommercialUsageAuthorized(),
                event.getFolderPath(),

                event.getLocation(),
                event.getAdditionalContact(),
                event.getTimeline().stream().map(this::toTimelineEntryResponse).toList(),
                event.getNotes(),
                event.getCreatedAt(),
                event.getUpdatedAt());
    }

    public EventResponse.TimelineEntryResponse toTimelineEntryResponse(Event.Entry entry) {
        if (entry == null)
            return null;
        return new EventResponse.TimelineEntryResponse(
                entry.getStartTime(),
                entry.getActivity(),
                entry.getAddress(),
                entry.getNotes());
    }

    public TaskResponse toResponse(Task task) {
        if (task == null)
            return null;

        return new TaskResponse(
                task.getId(),
                toResponse(task.getClient()),
                task.getPhotoshoot() != null ? task.getPhotoshoot().getId() : null,
                task.getEvent() != null ? task.getEvent().getId() : null,
                task.getDueDate(),
                task.getItemList().stream()
                        .map(this::toTaskItemResponse)
                        .toList(),
                task.getCreatedAt(),
                task.getUpdatedAt());
    }

    public TaskResponse.TaskItemResponse toTaskItemResponse(Task.TaskItem item) {
        if (item == null)
            return null;
        return new TaskResponse.TaskItemResponse(
                item.getTaskName(),
                item.getTaskDescription(),
                item.getStatus());
    }

    public ScheduleResponse toResponse(Schedule schedule) {
        if (schedule == null)
            return null;

        Schedule.Date date = schedule.getDate();
        Schedule.Time time = schedule.getTime();

        return new ScheduleResponse(
                schedule.getId(),
                schedule.getDayOfWeek(),

                schedule.getStaff() != null ? schedule.getStaff().getId() : null,
                schedule.getBusiness() != null ? schedule.getBusiness().getId() : null,

                date != null ? date.getStartRange() : null,
                date != null ? date.getEndRange() : null,
                date != null ? date.getExcludedDates() : null,

                time != null ? time.getStartTime() : null,
                time != null ? time.getEndTime() : null,
                time != null ? time.getBreakStartTime() : null,
                time != null ? time.getBreakEndTime() : null);
    }

    public BusinessResponse toResponse(Business business) {
        if (business == null)
            return null;
        return new BusinessResponse(
                business.getId(),
                business.getName(),
                business.getTaxId(),
                business.getAddress(),
                business.getSchedules() != null
                        ? business.getSchedules().stream().map(this::toResponse).toList()
                        : null);
    }

}
