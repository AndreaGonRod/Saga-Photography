package com.photography.saga.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.photography.saga.model.enums.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record TaskResponse(
        Integer id,
        ClientResponse client,
        Integer photoshootId,
        Integer eventId,
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate dueDate,
        List<TaskItemResponse> itemList,
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
        LocalDateTime createdAt,
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
        LocalDateTime updatedAt
) {
    public record TaskItemResponse(
            String taskName,
            String taskDescription,
            TaskStatus status
    ) {}
}